#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Result;
use base64::engine::general_purpose::URL_SAFE_NO_PAD as B64;
use base64::Engine as _;
use chacha20poly1305::{
    aead::{Aead, KeyInit},
    XChaCha20Poly1305, XNonce,
};
use hkdf::Hkdf;
use hpke::{
    aead::ChaCha20Poly1305, kdf::HkdfSha256, kem::X25519HkdfSha256, Deserializable, OpModeR,
    OpModeS, Serializable,
};

// Normalized HPKE constants
const HPKE_INFO: &[u8] = b"zerochat/hpke-v1";
use keyring::Entry;
use once_cell::sync::Lazy;
use parking_lot::RwLock;
use rand::rngs::OsRng;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::Sha256;
use std::{fs, path::PathBuf, sync::Mutex};
use url::Url;
use uuid::Uuid;
use x25519_dalek::{PublicKey, StaticSecret};

static BASE: Lazy<Mutex<Url>> =
    Lazy::new(|| Mutex::new(Url::parse("http://127.0.0.1:8080").unwrap()));
static CREDS: Lazy<Mutex<Option<(String, String)>>> = Lazy::new(|| Mutex::new(None));

#[derive(Default)]
struct AppState {
    base_url: RwLock<String>,
    device_id: RwLock<Option<Uuid>>,
}

#[derive(Serialize, Deserialize)]
struct RedeemResp {
    user_id: Uuid,
    device_id: Uuid,
    device_token: String, // Backward compat
    device_auth: Option<String>, // New field
}

#[derive(Deserialize)]
struct SignupResp {
    provision_token: String,
}

#[derive(Deserialize)]
struct UserIdResp {
    user_id: Uuid,
}

#[derive(Deserialize)]
struct DeviceIdentity {
    device_id: Uuid,
    identity_key_b64: String,
}

#[derive(Deserialize)]
struct DeviceIdentitiesResp {
    identities: Vec<DeviceIdentity>,
}

fn app_data_dir() -> anyhow::Result<PathBuf> {
    use std::env;
    
    // Use Tauri's platform data dir if available, otherwise fall back to platform-specific defaults
    let base = tauri::api::path::data_dir().or_else(|| {
        // Fallback for when Tauri context isn't available (e.g., during init)
        #[cfg(target_os = "macos")]
        {
            env::var("HOME").ok().map(|home| {
                PathBuf::from(format!("{home}/Library/Application Support"))
            })
        }
        #[cfg(not(target_os = "macos"))]
        {
            dirs::data_dir()
        }
    }).ok_or_else(|| anyhow::anyhow!("no data dir available"))?;
    
    let suffix = env::var("APP_PROFILE")
        .ok()
        .filter(|s| !s.is_empty())
        .map(|s| format!("-{}", s))
        .unwrap_or_default();
    
    Ok(base.join(format!("ZeroChat{}", suffix)))
}

fn app_dir() -> PathBuf {
    dirs::home_dir()
        .map(|p| p.join(".zerochat-desktop"))
        .expect("home dir")
}

fn set_creds(did: String, tok: String) {
    *CREDS.lock().unwrap() = Some((did, tok));
}

fn get_creds() -> Option<(String, String)> {
    CREDS.lock().unwrap().clone()
}

fn save_device_creds(device_id: &str, token: &str) -> anyhow::Result<()> {
    let dir = app_data_dir()?;
    fs::create_dir_all(&dir)?;
    fs::write(dir.join("device_id.txt"), device_id)?;
    fs::write(dir.join("device_auth.txt"), token)?;
    Ok(())
}

fn load_device_creds() -> Option<(String, String)> {
    let dir = app_data_dir().ok()?;
    let did = fs::read_to_string(dir.join("device_id.txt")).ok()?.trim().to_string();
    let tok = fs::read_to_string(dir.join("device_auth.txt")).ok()?.trim().to_string();
    Some((did, tok))
}

// Helper to get auth headers for API calls
fn get_auth_headers() -> Result<(String, String), String> {
    get_creds()
        .or_else(|| load_device_creds())
        .ok_or_else(|| "not provisioned".to_string())
}

fn load_creds_from_disk() -> anyhow::Result<(String, String)> {
    let (did, tok) = load_device_creds()
        .ok_or_else(|| anyhow::anyhow!("no credentials found"))?;
    set_creds(did.clone(), tok.clone());
    Ok((did, tok))
}

fn api_url(path: &str) -> Result<Url, String> {
    let base = BASE.lock().unwrap().clone();
    // Remove leading slash from path if present, as join() expects relative paths
    let clean_path = path.strip_prefix('/').unwrap_or(path);
    base.join(clean_path)
        .map_err(|e| format!("bad URL path {path} with base {}: {e}", base))
}

// HPKE seal: encrypt plaintext to recipient's public key
fn hpke_seal(recipient_pk_bytes: &[u8], plaintext: &[u8]) -> Result<String, String> {
    let recipient_pk = <X25519HkdfSha256 as hpke::kem::Kem>::PublicKey::from_bytes(
        recipient_pk_bytes
            .try_into()
            .map_err(|_| "recipient public key must be 32 bytes")?,
    )
    .map_err(|e| format!("bad recipient key: {e}"))?;

    let mut rng = rand::rngs::OsRng;
    let (enc, mut sender_ctx) = hpke::setup_sender::<ChaCha20Poly1305, HkdfSha256, X25519HkdfSha256, rand::rngs::OsRng>(
        &OpModeS::Base,
        &recipient_pk,
        HPKE_INFO,
        &mut rng,
    )
    .map_err(|e| format!("hpke setup: {e}"))?;

    let ct = sender_ctx
        .seal(plaintext, &[])
        .map_err(|e| format!("hpke seal: {e}"))?; // AAD = []

    let mut payload = Vec::with_capacity(enc.to_bytes().len() + ct.len());
    payload.extend_from_slice(&enc.to_bytes()); // 32 bytes
    payload.extend_from_slice(&ct); // ciphertext + tag

    Ok(B64.encode(&payload)) // URL-safe, no padding
}

// HPKE open: decrypt ciphertext using our secret key
fn hpke_open(my_sk_bytes: &[u8], b64_payload: &str) -> Result<Vec<u8>, String> {
    let buf = B64
        .decode(b64_payload.as_bytes())
        .map_err(|e| format!("base64 decode: {e}"))?;

    if buf.len() < 32 + 16 {
        return Err(format!("hpke payload too short: {} (need at least 48 bytes)", buf.len()));
    }

    let enc_bytes = &buf[..32];
    let ct = &buf[32..];

    debug_assert_eq!(buf.len() - 32, ct.len(), "ct length mismatch");

    eprintln!(
        "decoded={} enc.len={} ct.len={} (expected ct={})",
        buf.len(),
        enc_bytes.len(),
        ct.len(),
        buf.len() - 32
    );

    let enc = <X25519HkdfSha256 as hpke::kem::Kem>::EncappedKey::from_bytes(
        enc_bytes
            .try_into()
            .map_err(|_| "encapped key must be 32 bytes")?,
    )
    .map_err(|e| format!("bad encapped key: {e}"))?;

    let my_sk = <X25519HkdfSha256 as hpke::kem::Kem>::PrivateKey::from_bytes(
        my_sk_bytes
            .try_into()
            .map_err(|_| "secret key must be 32 bytes")?,
    )
    .map_err(|e| format!("bad secret key: {e}"))?;

    let mut receiver_ctx =
        hpke::setup_receiver::<ChaCha20Poly1305, HkdfSha256, X25519HkdfSha256>(
            &OpModeR::Base,
            &my_sk,
            &enc,
            HPKE_INFO,
        )
        .map_err(|e| format!("hpke receiver setup: {e}"))?;

    let pt = receiver_ctx
        .open(ct, &[])
        .map_err(|e| format!("hpke open: {e}"))?; // AAD = []

    Ok(pt)
}

fn key_paths() -> (PathBuf, PathBuf) {
    let dir = app_dir();
    (dir.join("x25519.sk"), dir.join("x25519.pk"))
}

fn derive_key(shared: &[u8]) -> [u8; 32] {
    let hk = Hkdf::<Sha256>::new(None, shared);
    let mut okm = [0u8; 32];
    hk.expand(b"zerochat-desktop-v1", &mut okm)
        .expect("hkdf expand");
    okm
}

fn device_id_path() -> PathBuf {
    app_dir().join("device_id.txt")
}

fn save_device_id(device_id: Uuid) -> Result<()> {
    fs::create_dir_all(app_dir()).map_err(|e| anyhow::anyhow!("create dir: {e}"))?;
    fs::write(device_id_path(), device_id.to_string())?;
    Ok(())
}

fn try_load_device_id() -> Result<Uuid> {
    let path = device_id_path();
    let s = fs::read_to_string(&path)?;
    Ok(Uuid::parse_str(&s.trim())?)
}

fn save_token(device_id: Uuid, token: &str) -> Result<()> {
    Entry::new("zerochat", &format!("device:{device_id}"))?.set_password(token)?;
    Ok(())
}

fn load_token(device_id: Uuid) -> Result<String> {
    Ok(Entry::new("zerochat", &format!("device:{device_id}"))?.get_password()?)
}

fn try_load_stored_creds() -> Option<(Uuid, String)> {
    let device_id = try_load_device_id().ok()?;
    let token = load_token(device_id).ok()?;
    Some((device_id, token))
}

#[tauri::command]
fn set_base(base: String) -> Result<String, String> {
    let url = Url::parse(&base).map_err(|e| e.to_string())?;
    *BASE.lock().unwrap() = url;
    
    // Try to auto-load credentials when base is set
    if let Ok((did, tok)) = load_creds_from_disk() {
        set_creds(did.clone(), tok.clone());
        return Ok(format!("Base URL set, loaded credentials for device: {did}"));
    }
    
    Ok("Base URL set".into())
}

#[tauri::command]
async fn provision_with_token(token: String, base_url: Option<String>) -> Result<String, String> {
    eprintln!("🎫 [TAURI] ========== PROVISION WITH TOKEN CALLED ==========");
    eprintln!("🎫 [TAURI] Token length: {} chars", token.len());
    
    // Set base URL if provided
    if let Some(base) = base_url {
        let url = Url::parse(&base).map_err(|e| {
            eprintln!("🎫 [TAURI] ❌ Invalid base URL: {}", e);
            format!("invalid base URL: {e}")
        })?;
        *BASE.lock().unwrap() = url;
    }
    
    let base = BASE.lock().unwrap().to_string();
    if base.is_empty() {
        eprintln!("🎫 [TAURI] ❌ Base URL not set");
        return Err("Set base URL first".into());
    }
    
    eprintln!("🎫 [TAURI] Using base URL: {}", base);

    let http = Client::new();
    let provision_url = api_url("api/provision/redeem")?.to_string();
    eprintln!("🎫 [TAURI] Calling provision endpoint: {}", provision_url);
    
    let resp = http
        .post(&provision_url)
        .json(&serde_json::json!({
            "token": token,
            "platform": "desktop",
            "push_token": null
        }))
        .send()
        .await
        .map_err(|e| {
            eprintln!("🎫 [TAURI] ❌ Network error: {}", e);
            e.to_string()
        })?;
    
    let status = resp.status();
    eprintln!("🎫 [TAURI] Provision response status: {} {}", status.as_u16(), status.canonical_reason().unwrap_or(""));
    
    let resp = resp
        .error_for_status()
        .map_err(|e| {
            eprintln!("🎫 [TAURI] ❌ HTTP error: {}", e);
            e.to_string()
        })?;
    
    let redeem_resp = resp
        .json::<RedeemResp>()
        .await
        .map_err(|e| {
            eprintln!("🎫 [TAURI] ❌ Failed to parse response: {}", e);
            e.to_string()
        })?;
    
    eprintln!("🎫 [TAURI] ✅ Provision response received:");
    eprintln!("🎫 [TAURI]   - user_id: {}", redeem_resp.user_id);
    eprintln!("🎫 [TAURI]   - device_id: {}", redeem_resp.device_id);
    eprintln!("🎫 [TAURI]   - device_auth present: {}", redeem_resp.device_auth.is_some());
    eprintln!("🎫 [TAURI]   - device_token present: {}", !redeem_resp.device_token.is_empty());

    // Use device_auth if available, otherwise fall back to device_token
    let auth_token = redeem_resp.device_auth.unwrap_or(redeem_resp.device_token);
    eprintln!("🎫 [TAURI] Using auth token (length: {})", auth_token.len());
    
    // Save credentials using the new helper
    eprintln!("🎫 [TAURI] Saving credentials to disk...");
    save_device_creds(&redeem_resp.device_id.to_string(), &auth_token)
        .map_err(|e| {
            eprintln!("🎫 [TAURI] ❌ Failed to save credentials: {}", e);
            format!("failed to save credentials: {e}")
        })?;
    set_creds(redeem_resp.device_id.to_string(), auth_token.clone());
    eprintln!("🎫 [TAURI] ✅ Credentials saved successfully");
    eprintln!("🎫 [TAURI] ========== PROVISION WITH TOKEN COMPLETED ==========");
    
    Ok(redeem_resp.device_id.to_string())
}

#[tauri::command]
async fn login(username: String, password: String, base_url: Option<String>) -> Result<String, String> {
    eprintln!("🔐 [TAURI] ========== LOGIN COMMAND CALLED ==========");
    eprintln!("🔐 [TAURI] Username: {}", username);
    eprintln!("🔐 [TAURI] Password length: {} bytes", password.len());
    
    // Set base URL if provided, otherwise use default
    if let Some(base) = base_url {
        let url = Url::parse(&base).map_err(|e| {
            eprintln!("🔐 [TAURI] ❌ Invalid base URL: {}", e);
            format!("invalid base URL: {e}")
        })?;
        *BASE.lock().unwrap() = url;
    } else {
        let url = Url::parse("http://127.0.0.1:8080").map_err(|e| {
            eprintln!("🔐 [TAURI] ❌ Failed to set default base: {}", e);
            format!("failed to set default base: {e}")
        })?;
        *BASE.lock().unwrap() = url;
    }
    
    let _base = BASE.lock().unwrap().to_string();
    eprintln!("🔐 [TAURI] Using base URL: {}", _base);

    let http = Client::new();
    let login_url = api_url("api/login")?.to_string();
    eprintln!("🔐 [TAURI] Calling login endpoint: {}", login_url);
    
    #[derive(Deserialize)]
    struct LoginResp {
        provision_token: String,
    }
    
    eprintln!("🔐 [TAURI] Sending login request...");
    let login_resp = http
        .post(&login_url)
        .json(&serde_json::json!({
            "username": username,
            "password": password
        }))
        .send()
        .await
        .map_err(|e| {
            eprintln!("🔐 [TAURI] ❌ Network error: {}", e);
            format!("Network error: {e}")
        })?;
    
    let status = login_resp.status();
    eprintln!("🔐 [TAURI] Login response status: {} {}", status.as_u16(), status.canonical_reason().unwrap_or(""));
    
    let login_resp = login_resp
        .error_for_status()
        .map_err(|e| {
            let status_code = e.status()
                .map(|s| s.as_u16().to_string())
                .unwrap_or_else(|| "unknown".to_string());
            let msg = format!("HTTP {}: {}", status_code, e.to_string());
            eprintln!("🔐 [TAURI] ❌ Login error: {}", msg);
            msg
        })?;
    
    let login_data = login_resp
        .json::<LoginResp>()
        .await
        .map_err(|e| {
            eprintln!("🔐 [TAURI] ❌ Failed to parse login response: {}", e);
            format!("Failed to parse response: {e}")
        })?;
    
    eprintln!("🔐 [TAURI] ✅ Got provision token (length: {})", login_data.provision_token.len());
    eprintln!("🔐 [TAURI] Redeeming provision token...");
    
    // Redeem the provision token
    let device_id = provision_with_token(login_data.provision_token, None).await.map_err(|e| {
        eprintln!("🔐 [TAURI] ❌ Provision failed: {}", e);
        e
    })?;
    
    eprintln!("🔐 [TAURI] ✅ Successfully provisioned device: {}", device_id);
    eprintln!("🔐 [TAURI] ========== LOGIN COMMAND COMPLETED ==========");
    Ok(format!("Logged in and provisioned device: {}", device_id))
}

#[tauri::command]
async fn signup(username: String, password: String, base_url: Option<String>, invite_token: Option<String>) -> Result<String, String> {
    // Set base URL if provided, otherwise use default
    if let Some(base) = base_url {
        let url = Url::parse(&base).map_err(|e| format!("invalid base URL: {e}"))?;
        *BASE.lock().unwrap() = url;
    } else {
        // Default to localhost
        let url = Url::parse("http://127.0.0.1:8080").map_err(|e| format!("failed to set default base: {e}"))?;
        *BASE.lock().unwrap() = url;
    }

    let base = BASE.lock().unwrap().to_string();
    eprintln!("Signup: Using base URL: {}", base);

    let http = Client::new();
    let signup_url = api_url("api/signup")?.to_string();
    eprintln!("Signup: Calling {}", signup_url);

    // Build signup request with optional invite_token
    let mut signup_body = serde_json::json!({
        "username": username,
        "password": password
    });

    if let Some(token) = invite_token {
        signup_body["invite_token"] = serde_json::Value::String(token);
        eprintln!("Signup: Including invite token in request");
    }

    let signup_resp = http
        .post(&signup_url)
        .json(&signup_body)
        .send()
        .await
        .map_err(|e| format!("Network error: {e}"))?
        .error_for_status()
        .map_err(|e| {
            let status_code = e.status()
                .map(|s| s.as_u16().to_string())
                .unwrap_or_else(|| "unknown".to_string());
            let msg = format!("HTTP {}: {}", status_code, e.to_string());
            eprintln!("Signup error: {}", msg);
            msg
        })?
        .json::<SignupResp>()
        .await
        .map_err(|e| format!("Failed to parse response: {e}"))?;

    eprintln!("Signup: Got provision token, redeeming...");

    // Now redeem the provision token
    let device_id = provision_with_token(signup_resp.provision_token, None).await?;

    eprintln!("Signup: Successfully provisioned device: {}", device_id);
    Ok(format!("Signed up and provisioned device: {}", device_id))
}

#[tauri::command]
async fn upload_identity_kp() -> Result<String, String> {
    // 1) ensure creds (try memory, then disk)
    let (did, tok) = match get_creds() {
        Some(ct) => ct,
        None => load_creds_from_disk().map_err(|e| e.to_string())?,
    };

    let dev_id = Uuid::parse_str(&did).map_err(|e| format!("bad device_id: {e}"))?;

    let http = Client::new();
    let (skp, pkp) = key_paths();
    let (_sk, pk) = if skp.exists() && pkp.exists() {
        let skb = fs::read(&skp).map_err(|e| e.to_string())?;
        let pkb = fs::read(&pkp).map_err(|e| e.to_string())?;
        (
            StaticSecret::from(<[u8; 32]>::try_from(skb.as_slice()).unwrap()),
            PublicKey::from(<[u8; 32]>::try_from(pkb.as_slice()).unwrap()),
        )
    } else {
        fs::create_dir_all(app_dir()).map_err(|e| e.to_string())?;
        let sk = StaticSecret::random_from_rng(OsRng);
        let pk = PublicKey::from(&sk);
        fs::write(&skp, sk.to_bytes()).map_err(|e| e.to_string())?;
        fs::write(&pkp, pk.to_bytes()).map_err(|e| e.to_string())?;
        (sk, pk)
    };

    let ik_b64 = B64.encode(pk.as_bytes());
    http.post(api_url("api/keys/set_identity")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&json!({
            "device_id": dev_id,
            "identity_key_b64": ik_b64
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;

    let mut kp_bytes = vec![0u8; 200];
    getrandom::getrandom(&mut kp_bytes).map_err(|e| e.to_string())?;
    let kp_b64 = B64.encode(kp_bytes);

    http.post(api_url("api/keys/upload_keypackage")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&json!({
            "device_id": dev_id,
            "keypackage_b64": kp_b64,
            "expires_minutes": 1440
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;

    Ok("Uploaded identity key and KP".into())
}

#[tauri::command]
async fn send_self_encrypted(plaintext: String) -> Result<String, String> {
    // Get credentials from global state
    let (did, tok) = match get_creds() {
        Some(ct) => ct,
        None => load_creds_from_disk().map_err(|e| e.to_string())?,
    };
    let dev_id = Uuid::parse_str(&did).map_err(|e| format!("bad device_id: {e}"))?;

    let (skp, pkp) = key_paths();
    let skb = fs::read(&skp).map_err(|e| e.to_string())?;
    let pkb = fs::read(&pkp).map_err(|e| e.to_string())?;
    let sk = StaticSecret::from(<[u8; 32]>::try_from(skb.as_slice()).unwrap());
    let pk = PublicKey::from(<[u8; 32]>::try_from(pkb.as_slice()).unwrap());
    let shared = sk.diffie_hellman(&pk);
    let key = derive_key(shared.as_bytes());
    let cipher = XChaCha20Poly1305::new((&key).into());
    let mut nonce = [0u8; 24];
    getrandom::getrandom(&mut nonce).map_err(|e| e.to_string())?;
    let mut blob = Vec::with_capacity(24 + plaintext.len() + 16);
    blob.extend_from_slice(&nonce);
    let ct = cipher
        .encrypt(XNonce::from_slice(&nonce), plaintext.as_bytes())
        .map_err(|e| e.to_string())?;
    blob.extend_from_slice(&ct);
    let b64 = B64.encode(&blob);

    Client::new()
        .post(api_url("api/messages/enqueue")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&serde_json::json!({
            "to_device_id": dev_id,
            "ciphertext_b64": b64,
            "expires_minutes": 60
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;

    Ok("queued".into())
}

#[tauri::command]
async fn send_self_hpke(plaintext: String) -> Result<String, String> {
    // Get credentials from global state
    let (did, tok) = match get_creds() {
        Some(ct) => ct,
        None => load_creds_from_disk().map_err(|e| e.to_string())?,
    };
    let dev_id = Uuid::parse_str(&did).map_err(|e| format!("bad device_id: {e}"))?;
    let http = Client::new();

    let (skp, pkp) = key_paths();
    let pkb = fs::read(&pkp).map_err(|e| e.to_string())?;
    if pkb.len() != 32 {
        return Err("bad local public key length".into());
    }
    let pk_arr: [u8; 32] = pkb
        .as_slice()
        .try_into()
        .map_err(|_| "bad local public key length".to_string())?;
    
    // Verify the public key matches the secret key
    let skb = fs::read(&skp).map_err(|e| e.to_string())?;
    let sk_arr: [u8; 32] = skb
        .as_slice()
        .try_into()
        .map_err(|_| "bad secret key bytes".to_string())?;
    let sk = StaticSecret::from(sk_arr);
    let derived_pk = PublicKey::from(&sk);
    if derived_pk.as_bytes() != &pk_arr {
        eprintln!("WARNING: Public key on disk doesn't match secret key! Using disk public key anyway.");
    }
    
    eprintln!("Encrypting with public key (first 8): {:?}", &pk_arr[..8.min(pk_arr.len())]);

    let b64 = hpke_seal(&pk_arr, plaintext.as_bytes())
        .map_err(|e| format!("hpke_seal failed: {e}"))?;

    let enqueue_url = api_url("api/messages/enqueue")?.to_string();
    let enqueue_body = serde_json::json!({
        "to_device_id": dev_id,
        "ciphertext_b64": b64,
        "ciphertext": b64,
        "expires_minutes": 60
    });
    
    eprintln!("Enqueue URL: {}", enqueue_url);
    eprintln!("Enqueue body device_id: {}", dev_id);
    eprintln!("Enqueue header device_id: {}", did);
    
    let resp = http
        .post(&enqueue_url)
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&enqueue_body)
        .send()
        .await
        .map_err(|e| format!("enqueue request failed: {e}"))?
        .error_for_status()
        .map_err(|e| format!("enqueue HTTP error: {e}"))?;
    
    let resp_text = resp.text().await.map_err(|e| e.to_string())?;
    eprintln!("Enqueue response: {}", resp_text);

    Ok("queued (self HPKE)".into())
}

#[tauri::command]
async fn send_to_username_hpke(
    username: String,
    plaintext: String,
) -> Result<String, String> {
    // Get credentials from global state
    let (did, tok) = match get_creds() {
        Some(ct) => ct,
        None => load_creds_from_disk().map_err(|e| e.to_string())?,
    };
    let username = username.trim().to_string();
    if username.is_empty() {
        return Err("Username required".to_string());
    }
    let http = Client::new();

    let uid = http
        .get(api_url(&format!("api/users/by_username/{username}"))?.to_string())
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json::<UserIdResp>()
        .await
        .map_err(|e| e.to_string())?
        .user_id;

    let target = http
        .get(api_url(&format!("api/keys/identities/{uid}"))?.to_string())
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json::<DeviceIdentitiesResp>()
        .await
        .map_err(|e| e.to_string())?
        .identities
        .into_iter()
        .next()
        .ok_or_else(|| "Recipient has no active devices".to_string())?;

    let recip_pk_bytes = B64
        .decode(target.identity_key_b64.as_bytes())
        .map_err(|e| e.to_string())?;
    
    if recip_pk_bytes.len() != 32 {
        return Err(format!("recipient public key must be 32 bytes, got {}", recip_pk_bytes.len()));
    }

    let b64 = hpke_seal(&recip_pk_bytes, plaintext.as_bytes())
        .map_err(|e| format!("hpke_seal failed: {e}"))?;

    #[derive(Deserialize)]
    struct SendUsernameResp {
        queued: bool,
        count: i64,
    }

    let resp = http
        .post(api_url("api/messages/send_username")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&serde_json::json!({
            "to_username": username,
            "ciphertext_b64": b64
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json::<SendUsernameResp>()
        .await
        .map_err(|e| e.to_string())?;

    Ok(format!(
        "sent to {} ({} device(s))",
        username, resp.count
    ))
}

#[tauri::command]
async fn pull_and_decrypt() -> Result<Vec<String>, String> {
    // Get credentials from global state
    let (did, tok) = match get_creds() {
        Some(ct) => ct,
        None => load_creds_from_disk().map_err(|e| e.to_string())?,
    };
    let dev_id = Uuid::parse_str(&did).map_err(|e| format!("bad device_id: {e}"))?;

    let http = Client::new();
    let pull_url = api_url("api/messages/pull")?.to_string();
    let pull_body = serde_json::json!({ "device_id": dev_id, "max": 20 });
    
    let text = http
        .post(&pull_url)
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&pull_body)
        .send()
        .await
        .map_err(|e| format!("pull request failed: {e}"))?
        .error_for_status()
        .map_err(|e| format!("pull HTTP error: {e}"))?
        .text()
        .await
        .map_err(|e| format!("pull read error: {e}"))?;

    // Debug: log the response
    eprintln!("Pull response: {}", text);
    eprintln!("Pull URL: {}", pull_url);
    eprintln!("Pull body: {}", serde_json::to_string(&pull_body).unwrap());
    eprintln!("Device ID: {}", did);

    let v: Value =
        serde_json::from_str(&text).map_err(|e| format!("bad json: {e}; body={text}"))?;

    let msgs = if v.is_array() {
        v.as_array().unwrap().clone()
    } else {
        v.get("messages")
            .and_then(|x| x.as_array())
            .cloned()
            .unwrap_or_default()
    };

    let (skp, pkp) = key_paths();
    let skb = fs::read(&skp).map_err(|e| e.to_string())?;
    let pkb = fs::read(&pkp).map_err(|e| e.to_string())?;
    
    // Verify the keys match
    let sk_arr: [u8; 32] = skb
        .as_slice()
        .try_into()
        .map_err(|_| "bad secret key bytes".to_string())?;
    let pk_arr: [u8; 32] = pkb
        .as_slice()
        .try_into()
        .map_err(|_| "bad public key bytes".to_string())?;
    
    let sk = StaticSecret::from(sk_arr);
    let pk = PublicKey::from(&sk);
    
    // Verify the public key matches what we have on disk
    if pk.as_bytes() != &pk_arr {
        eprintln!("WARNING: Public key mismatch! Regenerating keys...");
        // This shouldn't happen, but if it does, we need to regenerate
        return Err("Key mismatch detected".to_string());
    }
    
    eprintln!("Using secret key for decryption, public key verified");
    eprintln!("Secret key bytes (first 8): {:?}", &sk_arr[..8.min(sk_arr.len())]);
    eprintln!("Public key bytes (first 8): {:?}", &pk_arr[..8.min(pk_arr.len())]);

    eprintln!("Found {} messages to decrypt", msgs.len());
    
    let mut out = vec![];
    let mut ack_ids = vec![];
    
    for (idx, m) in msgs.iter().enumerate() {
        eprintln!("Processing message {}: {:?}", idx, m);
        
        // Get message ID for ack
        let msg_id = m
            .get("id")
            .and_then(|x| x.as_str())
            .and_then(|s| Uuid::parse_str(s).ok());
        
        let b64 = m
            .get("ciphertext_b64")
            .and_then(|x| x.as_str())
            .or_else(|| m.get("ciphertext").and_then(|x| x.as_str()))
            .unwrap_or("");
        if b64.is_empty() {
            eprintln!("Message {}: no ciphertext field", idx);
            continue;
        }

        match hpke_open(&sk_arr, b64) {
            Ok(pt) => {
                let plaintext = String::from_utf8_lossy(&pt).to_string();
                eprintln!("Message {}: successfully decrypted: {}", idx, plaintext);
                out.push(plaintext);
                
                // Collect ID for ack
                if let Some(id) = msg_id {
                    ack_ids.push(id);
                }
            },
            Err(e) => {
                eprintln!("Message {}: failed to decrypt: {}", idx, e);
            },
        }
    }

    // Ack all successfully decrypted messages
    if !ack_ids.is_empty() {
        let ack_url = api_url("api/messages/ack")?.to_string();
        let _ = http
            .post(&ack_url)
            .header("x-device-id", &did)
            .header("x-device-auth", &tok)
            .json(&serde_json::json!({ "ids": ack_ids }))
            .send()
            .await;
        eprintln!("Acked {} messages", ack_ids.len());
    }

    Ok(out)
}

#[tauri::command]
async fn friend_request(to_username: String) -> Result<String, String> {
    let (did, tok) = get_auth_headers()?;
    let http = Client::new();
    
    let _resp = http
        .post(api_url("api/friends/request")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&serde_json::json!({ "username": to_username }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;
    
    Ok(format!("Friend request sent to {}", to_username))
}

#[tauri::command]
async fn friend_respond(from_username: String, accept: bool) -> Result<String, String> {
    let (did, tok) = get_auth_headers()?;
    let http = Client::new();
    
    let _resp = http
        .post(api_url("api/friends/respond")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .json(&serde_json::json!({ 
            "from_username": from_username,
            "accept": accept
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;
    
    Ok(format!("Friend request {} from {}", 
        if accept { "accepted" } else { "rejected" },
        from_username))
}

#[derive(Serialize, Deserialize)]
struct Friend {
    username: String,
    user_id: String,
    status: String,
    created_at: String,
}

#[derive(Deserialize)]
struct FriendsListResp {
    friends: Vec<Friend>,
}

#[tauri::command]
async fn friends_list() -> Result<Vec<Friend>, String> {
    let (did, tok) = get_auth_headers()?;
    let http = Client::new();
    
    let resp = http
        .get(api_url("api/friends/list")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json::<FriendsListResp>()
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(resp.friends)
}

#[tauri::command]
async fn dev_provision(username: String, admin_token: Option<String>) -> Result<String, String> {
    let uname = username.trim();
    if uname.is_empty() {
        return Err("username cannot be empty".to_string());
    }
    
    let admin = admin_token
        .or_else(|| std::env::var("ADMIN_TOKEN").ok())
        .ok_or_else(|| "missing ADMIN_TOKEN".to_string())?;

    let url = api_url("api/dev/provision_direct")?;

    let client = Client::new();
    let resp = client
        .post(url)
        .header("x-admin-token", admin)
        .json(&json!({"username": uname, "platform": "desktop"}))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?;

    let v: Value = resp.json().await.map_err(|e| e.to_string())?;
    let did = v["device_id"]
        .as_str()
        .ok_or_else(|| "missing device_id".to_string())?
        .to_string();
    let tok = v["device_token"]
        .as_str()
        .ok_or_else(|| "missing device_token".to_string())?
        .to_string();

    // persist for future runs
    save_device_creds(&did, &tok).map_err(|e| e.to_string())?;

    set_creds(did.clone(), tok.clone());
    Ok(format!("provisioned device: {did}"))
}

// Parse invite link and extract token/base
#[tauri::command]
fn parse_invite_link(link: String) -> Result<serde_json::Value, String> {
    let u = Url::parse(&link).map_err(|e| format!("invalid URL: {e}"))?;
    
    if u.scheme() != "zerochat" {
        return Err("URL scheme must be 'zerochat'".to_string());
    }
    
    if u.host_str() != Some("provision") && u.domain() != Some("provision") {
        return Err("URL host must be 'provision'".to_string());
    }
    
    let mut token: Option<String> = None;
    let mut base: Option<String> = None;
    
    for (k, v) in u.query_pairs() {
        match &*k {
            "token" => token = Some(v.to_string()),
            "base" => {
                // URL-decode the base parameter
                base = Some(
                    urlencoding::decode(&v)
                        .map(|s| s.to_string())
                        .unwrap_or_else(|_| v.to_string()),
                );
            }
            _ => {}
        }
    }
    
    if token.is_none() {
        return Err("missing 'token' parameter".to_string());
    }
    
    Ok(serde_json::json!({
        "token": token.unwrap(),
        "base": base
    }))
}

// Auto-provision: set base → redeem token → upload identity & KP
#[tauri::command]
async fn auto_provision(token: String, base_url: Option<String>) -> Result<String, String> {
    // Step 1: Set base URL
    if let Some(base) = base_url {
        let url = Url::parse(&base).map_err(|e| format!("invalid base URL: {e}"))?;
        *BASE.lock().unwrap() = url;
    } else {
        // Use existing base or default
        let current_base = BASE.lock().unwrap().to_string();
        if current_base.is_empty() {
            *BASE.lock().unwrap() = Url::parse("http://127.0.0.1:8080")
                .map_err(|e| format!("failed to set default base: {e}"))?;
        }
    }

    // Step 2: Redeem token
    let device_id = provision_with_token(token, None).await?;
    eprintln!("Auto-provision: redeemed token, device_id: {}", device_id);

    // Step 3: Upload identity & KP
    upload_identity_kp().await?;
    eprintln!("Auto-provision: uploaded identity and KeyPackage");

    Ok(format!("Auto-provision complete: {}", device_id))
}

// Alias for frontend compatibility
#[tauri::command]
async fn upload_identity_and_keypackage() -> Result<String, String> {
    upload_identity_kp().await
}

// Start background pull loop (frontend will poll manually)
#[tauri::command]
async fn start_pull_loop() -> Result<String, String> {
    // Frontend will call pull_and_decrypt in a setInterval
    Ok("Pull loop started (frontend polling)".into())
}

#[tauri::command]
async fn create_invite(friend_hint: Option<String>, ttl_minutes: Option<i64>) -> Result<serde_json::Value, String> {
    let (did, tok) = get_auth_headers()?;
    let http = Client::new();
    
    let base = BASE.lock().unwrap().to_string();
    
    // For invite links, use the actual base URL so phones can access it
    // If base is localhost, try to detect network IP
    let base_for_invite = if base.contains("127.0.0.1") || base.contains("localhost") {
        // Try to get network IP - for now, we'll use the base as-is
        // User should set BASE_PUBLIC_URL env var or use network IP
        base.clone() // Keep as-is, but log a warning
    } else {
        base.clone()
    };
    
    let req = http
        .post(api_url("api/invite/create")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .header("x-base-url", &base_for_invite);
    
    let body = serde_json::json!({
        "friend_hint": friend_hint,
        "ttl_minutes": ttl_minutes
    });
    
    let resp = req
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(resp)
}

#[tauri::command]
async fn get_me() -> Result<serde_json::Value, String> {
    let (did, tok) = get_auth_headers()?;
    let http = Client::new();
    
    let resp = http
        .get(api_url("api/me")?.to_string())
        .header("x-device-id", &did)
        .header("x-device-auth", &tok)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map_err(|e| e.to_string())?
        .json::<serde_json::Value>()
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(resp)
}

#[tauri::command]
async fn load_creds() -> Result<serde_json::Value, String> {
    let (did, tok) = load_creds_from_disk().map_err(|e| e.to_string())?;
    Ok(serde_json::json!({
        "device_id": did,
        "device_auth": tok
    }))
}

#[tauri::command]
fn get_base() -> Result<String, String> {
    Ok(BASE.lock().unwrap().to_string())
}

async fn pull_messages_internal(
    http: &Client,
    did: &str,
    tok: &str,
    dev_id: Uuid,
) -> Result<Vec<String>, String> {
    let pull_url = api_url("api/messages/pull")?.to_string();
    let pull_body = serde_json::json!({ "device_id": dev_id, "max": 50 });
    
    let text = http
        .post(&pull_url)
        .header("x-device-id", did)
        .header("x-device-token", tok)
        .json(&pull_body)
        .send()
        .await
        .map_err(|e| format!("pull request failed: {e}"))?
        .error_for_status()
        .map_err(|e| format!("pull HTTP error: {e}"))?
        .text()
        .await
        .map_err(|e| format!("pull read error: {e}"))?;

    let v: Value =
        serde_json::from_str(&text).map_err(|e| format!("bad json: {e}; body={text}"))?;

    let msgs = if v.is_array() {
        v.as_array().unwrap().clone()
    } else {
        v.get("messages")
            .and_then(|x| x.as_array())
            .cloned()
            .unwrap_or_default()
    };

    // Decrypt messages
    let (skp, _) = key_paths();
    let skb = fs::read(&skp).map_err(|e| e.to_string())?;
    let sk_arr: [u8; 32] = skb
        .as_slice()
        .try_into()
        .map_err(|_| "bad secret key bytes".to_string())?;

    let mut out = vec![];
    for m in msgs {
        let b64 = m
            .get("ciphertext_b64")
            .and_then(|x| x.as_str())
            .or_else(|| m.get("ciphertext").and_then(|x| x.as_str()))
            .unwrap_or("");
        if b64.is_empty() {
            continue;
        }

        match hpke_open(&sk_arr, b64) {
            Ok(pt) => {
                let plaintext = String::from_utf8_lossy(&pt).to_string();
                out.push(plaintext);
            }
            Err(_) => {
                // Skip decryption errors silently in pull loop
                continue;
            }
        }
    }

    Ok(out)
}

fn main() {
    // Auto-load base URL and credentials on startup
    if let Ok(base_str) = std::env::var("ZEROCHAT_BASE_URL") {
        if let Ok(url) = Url::parse(&base_str) {
            *BASE.lock().unwrap() = url;
        }
    } else {
        // Default to localhost
        if let Ok(url) = Url::parse("http://127.0.0.1:8080") {
            *BASE.lock().unwrap() = url;
        }
    }
    
    // Try to load credentials from disk
    let _ = load_creds_from_disk();
    
    // Deep link handler - currently unused as Tauri 1.5 doesn't support RunEvent::Opened
    // Deep links are handled via frontend event listeners in the React app
    // This function is kept for future Tauri 2.x compatibility
    #[allow(dead_code)]
    fn handle_deeplink(_app: &tauri::AppHandle, _url_str: &str) {
        // Future implementation for Tauri 2.x
    }
    
    tauri::Builder::default()
        .manage(AppState::default())
        .invoke_handler(tauri::generate_handler![
            set_base,
            signup,
            login,
            provision_with_token,
            dev_provision,
            upload_identity_kp,
            upload_identity_and_keypackage,
            send_self_encrypted,
            send_self_hpke,
            send_to_username_hpke,
            pull_and_decrypt,
            auto_provision,
            parse_invite_link,
            start_pull_loop,
            friend_request,
            friend_respond,
            friends_list,
            create_invite,
            get_me,
            load_creds,
            get_base
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri app")
        .run(|_app_handle, _event| {
            // Deep links are handled via frontend event listeners
            // Protocol registration happens at app install time on macOS/Windows
            // For development, use the frontend paste mechanism or test with installed app
        });
}
