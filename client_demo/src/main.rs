use anyhow::{anyhow, Result};
use base64::engine::general_purpose::URL_SAFE_NO_PAD as B64;
use base64::Engine;
use chacha20poly1305::{
    aead::{Aead, KeyInit},
    XChaCha20Poly1305, XNonce,
};
use hkdf::Hkdf;
use rand_core::{OsRng, RngCore};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use std::{fs, path::PathBuf};
use uuid::Uuid;
use x25519_dalek::{PublicKey, StaticSecret};

const BASE: &str = "http://localhost:8080";
const ADMIN_TOKEN: &str = "dev-admin-123";
const SENDER_PK_PATH: &str = ".sender_x25519.pk";
const SENDER_SK_PATH: &str = ".sender_x25519.sk";
const RECEIVER_PK_PATH: &str = ".receiver_x25519.pk";
const RECEIVER_SK_PATH: &str = ".receiver_x25519.sk";

#[derive(Serialize, Deserialize)]
struct CreateUserReq {
    username: String,
}

#[derive(Serialize, Deserialize)]
struct CreateUserResp {
    user_id: Uuid,
}

#[derive(Serialize, Deserialize)]
struct ProvisionCreateReq {
    user_id: Uuid,
    purpose: String,
    ttl_minutes: Option<i64>,
}

#[derive(Serialize, Deserialize)]
struct ProvisionCreateResp {
    token: String,
    expires_at: String,
}

#[derive(Serialize, Deserialize)]
struct ProvisionRedeemReq {
    token: String,
    platform: String,
    push_token: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct ProvisionRedeemResp {
    user_id: Uuid,
    device_id: Uuid,
    device_token: String,
}

#[derive(Serialize, Deserialize)]
struct SetIdentityReq {
    device_id: Uuid,
    identity_key_b64: String,
}

#[derive(Serialize, Deserialize)]
struct SetIdentityResp {
    device_id: Uuid,
    ok: bool,
}

#[derive(Serialize, Deserialize)]
struct EnqueueReq {
    to_device_id: Uuid,
    ciphertext_b64: String,
    expires_minutes: Option<i64>,
}

#[derive(Serialize, Deserialize)]
struct EnqueueResp {
    message_id: Uuid,
    queued: bool,
}

#[derive(Serialize, Deserialize)]
struct PullReq {
    device_id: Uuid,
    max: Option<i64>,
}

#[derive(Serialize, Deserialize)]
struct PulledMsg {
    id: Uuid,
    ciphertext_b64: String,
}

#[derive(Serialize, Deserialize)]
struct PullResp {
    device_id: Uuid,
    messages: Vec<PulledMsg>,
}

#[tokio::main]
async fn main() -> Result<()> {
    let http = Client::new();

    // 1) Create sender and receiver users
    let sender_user = create_user(&http, "alice").await?;
    let receiver_user = create_user(&http, "bob").await?;
    println!(
        "users -> sender={}, receiver={}",
        sender_user, receiver_user
    );

    // 2) Mint and redeem provisioning tokens to get devices
    let (sender_dev, sender_tok) = create_and_redeem(&http, sender_user, "desktop").await?;
    let (receiver_dev, receiver_tok) = create_and_redeem(&http, receiver_user, "desktop").await?;
    println!(
        "devices -> sender={}, receiver={}",
        sender_dev, receiver_dev
    );

    // 3) Generate X25519 keypairs locally and upload ONLY public keys
    let (sk_s, pk_s) = get_or_make_keys(SENDER_SK_PATH, SENDER_PK_PATH)?;
    let (sk_r, pk_r) = get_or_make_keys(RECEIVER_SK_PATH, RECEIVER_PK_PATH)?;
    upload_identity_key(&http, sender_dev, &sender_tok, &pk_s).await?;
    upload_identity_key(&http, receiver_dev, &receiver_tok, &pk_r).await?;
    println!("identity pubkeys uploaded");

    // 4) Derive shared secret (sender perspective) and encrypt plaintext
    let shared_sr = sk_s.diffie_hellman(&pk_r);
    let key_bytes = derive_key(shared_sr.as_bytes(), b"zeroclue-demo-v1");
    let cipher = XChaCha20Poly1305::new(key_bytes.as_slice().into());
    let nonce = random_nonce();
    let plaintext = b"hello bob - e2e works";
    let mut blob = Vec::with_capacity(24 + plaintext.len() + 16);
    blob.extend_from_slice(&nonce);
    let ct = cipher.encrypt(XNonce::from_slice(&nonce), plaintext.as_ref())?;
    blob.extend_from_slice(&ct);
    let b64 = B64.encode(&blob);

    // 5) Enqueue to receiver device
    let _ = http
        .post(format!("{BASE}/api/messages/enqueue"))
        .header("x-device-id", sender_dev.to_string())
        .header("x-device-token", &sender_tok)
        .json(&EnqueueReq {
            to_device_id: receiver_dev,
            ciphertext_b64: b64,
            expires_minutes: Some(60),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<EnqueueResp>()
        .await?;
    println!("message enqueued to receiver device");

    // 6) Receiver pulls and decrypts
    let pulled = http
        .post(format!("{BASE}/api/messages/pull"))
        .header("x-device-id", receiver_dev.to_string())
        .header("x-device-token", &receiver_tok)
        .json(&PullReq {
            device_id: receiver_dev,
            max: Some(10),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<PullResp>()
        .await?;

    if pulled.messages.is_empty() {
        return Err(anyhow!("no messages pulled"));
    }

    let blob = B64.decode(pulled.messages[0].ciphertext_b64.as_bytes())?;
    if blob.len() < 24 {
        return Err(anyhow!("blob too small"));
    }
    let (nonce, ct) = blob.split_at(24);
    let shared_rs = sk_r.diffie_hellman(&pk_s);
    let key_bytes_r = derive_key(shared_rs.as_bytes(), b"zeroclue-demo-v1");
    let cipher_r = XChaCha20Poly1305::new(key_bytes_r.as_slice().into());
    let pt = cipher_r.decrypt(XNonce::from_slice(nonce), ct)?;
    println!("receiver decrypted: {}", String::from_utf8_lossy(&pt));
    println!("✅ POC E2EE success");

    Ok(())
}

fn derive_key(shared: &[u8], info: &[u8]) -> Vec<u8> {
    let hk = Hkdf::<Sha256>::new(None, shared);
    let mut okm = [0u8; 32];
    hk.expand(info, &mut okm).expect("hkdf expand");
    okm.to_vec()
}

fn random_nonce() -> [u8; 24] {
    let mut n = [0u8; 24];
    OsRng.fill_bytes(&mut n);
    n
}

fn get_or_make_keys(sk_path: &str, pk_path: &str) -> Result<(StaticSecret, PublicKey)> {
    let skp = PathBuf::from(sk_path);
    let pkp = PathBuf::from(pk_path);
    if skp.exists() && pkp.exists() {
        let sk_bytes = fs::read(&skp)?;
        let pk_bytes = fs::read(&pkp)?;
        if sk_bytes.len() == 32 && pk_bytes.len() == 32 {
            let s = StaticSecret::from(<[u8; 32]>::try_from(sk_bytes.as_slice()).unwrap());
            let p = PublicKey::from(<[u8; 32]>::try_from(pk_bytes.as_slice()).unwrap());
            return Ok((s, p));
        }
    }

    let s = StaticSecret::random_from_rng(OsRng);
    let p = PublicKey::from(&s);
    fs::write(&skp, s.to_bytes())?;
    fs::write(&pkp, p.to_bytes())?;
    Ok((s, p))
}

async fn create_user(http: &Client, username: &str) -> Result<Uuid> {
    let resp = http
        .post(format!("{BASE}/api/users"))
        .header("x-admin-token", ADMIN_TOKEN)
        .json(&CreateUserReq {
            username: username.into(),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<CreateUserResp>()
        .await?;
    Ok(resp.user_id)
}

async fn create_and_redeem(http: &Client, user_id: Uuid, platform: &str) -> Result<(Uuid, String)> {
    let token = http
        .post(format!("{BASE}/api/provision/create"))
        .header("x-admin-token", ADMIN_TOKEN)
        .json(&ProvisionCreateReq {
            user_id,
            purpose: "install".into(),
            ttl_minutes: Some(30),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<ProvisionCreateResp>()
        .await?
        .token;

    let resp = http
        .post(format!("{BASE}/api/provision/redeem"))
        .json(&ProvisionRedeemReq {
            token,
            platform: platform.into(),
            push_token: None,
        })
        .send()
        .await?
        .error_for_status()?
        .json::<ProvisionRedeemResp>()
        .await?;

    Ok((resp.device_id, resp.device_token))
}

async fn upload_identity_key(
    http: &Client,
    device_id: Uuid,
    device_token: &str,
    pubkey: &PublicKey,
) -> Result<()> {
    let b64 = B64.encode(pubkey.as_bytes());
    let _ = http
        .post(format!("{BASE}/api/keys/set_identity"))
        .header("x-device-id", device_id.to_string())
        .header("x-device-token", device_token)
        .json(&SetIdentityReq {
            device_id,
            identity_key_b64: b64,
        })
        .send()
        .await?
        .error_for_status()?
        .json::<SetIdentityResp>()
        .await?;
    Ok(())
}
