use anyhow::{anyhow, Result};
use base64::engine::general_purpose::URL_SAFE_NO_PAD as B64;
use base64::Engine;
use openmls::framing::MlsMessageBodyIn;
use openmls::prelude::*;
use openmls_basic_credential::SignatureKeyPair;
use openmls_rust_crypto::OpenMlsRustCrypto;
use rand::RngCore;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tls_codec::{Deserialize as TlsDeserialize, Serialize as TlsSerialize};
use uuid::Uuid;

const BASE: &str = "http://localhost:8080";
const ADMIN_TOKEN: &str = "dev-admin-123";
const CS: Ciphersuite = Ciphersuite::MLS_128_DHKEMX25519_AES128GCM_SHA256_Ed25519;

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
}

#[derive(Serialize, Deserialize)]
struct ProvisionRedeemReq {
    token: String,
    platform: String,
    push_token: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct ProvisionRedeemResp {
    device_id: Uuid,
    user_id: Uuid,
    device_token: String,
}

#[derive(Serialize, Deserialize)]
struct UploadKPReq {
    device_id: Uuid,
    keypackage_b64: String,
    expires_minutes: Option<i64>,
}

#[derive(Serialize, Deserialize)]
struct UploadKPResp {
    keypackage_id: Uuid,
}

#[derive(Serialize, Deserialize)]
struct FetchForUserResp {
    packages: Vec<FetchedKP>,
}

#[derive(Serialize, Deserialize)]
struct FetchedKP {
    keypackage_id: Uuid,
    device_id: Uuid,
    keypackage_b64: String,
}

#[derive(Serialize, Deserialize)]
struct MarkUsedReq {
    keypackage_id: Uuid,
}

#[derive(Serialize, Deserialize)]
struct MarkUsedResp {
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
}

#[derive(Serialize, Deserialize)]
struct PullReq {
    device_id: Uuid,
    max: Option<i64>,
}

#[derive(Serialize, Deserialize, Clone)]
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
    let crypto = OpenMlsRustCrypto::default();

    let alice_uid = create_user(&http, "alice-mls").await?;
    let bob_uid = create_user(&http, "bob-mls").await?;
    let (alice_dev, alice_tok) = provision_device(&http, alice_uid).await?;
    let (bob_dev, bob_tok) = provision_device(&http, bob_uid).await?;

    let (bob_signer, bob_cred_with_key) = make_signer("bob");
    let bob_bundle = KeyPackage::builder()
        .build(CS, &crypto, &bob_signer, bob_cred_with_key.clone())
        .map_err(|e| anyhow!("build bob keypackage: {e:?}"))?;
    let bob_kp_bytes = bob_bundle
        .key_package()
        .tls_serialize_detached()
        .map_err(|e| anyhow!("serialize bob keypackage: {e:?}"))?;
    let bob_kp_id = upload_kp(&http, bob_dev, &bob_tok, &bob_kp_bytes).await?;

    let fetched = fetch_for_user(&http, bob_uid).await?;
    let fetched_entry = fetched
        .iter()
        .find(|kp| kp.keypackage_id == bob_kp_id)
        .or_else(|| fetched.first())
        .ok_or_else(|| anyhow!("no keypackages for bob"))?;
    let fetched_kp_bytes = B64.decode(fetched_entry.keypackage_b64.as_bytes())?;
    let mut fetched_slice = fetched_kp_bytes.as_slice();
    let kp_in = KeyPackageIn::tls_deserialize(&mut fetched_slice)
        .map_err(|e| anyhow!("deserialize fetched keypackage: {e:?}"))?;
    let kp = kp_in
        .validate(crypto.crypto(), ProtocolVersion::default())
        .map_err(|e| anyhow!("validate fetched keypackage: {e:?}"))?;

    let (alice_signer, alice_cred_with_key) = make_signer("alice");
    let gid = GroupId::from_slice(&rand_bytes(16));
    let create_cfg = MlsGroupCreateConfig::builder()
        .ciphersuite(CS)
        .use_ratchet_tree_extension(true)
        .build();
    let mut alice_group = MlsGroup::new_with_group_id(
        &crypto,
        &alice_signer,
        &create_cfg,
        gid,
        alice_cred_with_key.clone(),
    )
    .map_err(|e| anyhow!("create group: {e:?}"))?;

    let (_commit_msg, welcome_out, _gi) = alice_group
        .add_members(&crypto, &alice_signer, &[kp])
        .map_err(|e| anyhow!("add_members: {e:?}"))?;
    alice_group
        .merge_pending_commit(&crypto)
        .map_err(|e| anyhow!("merge commit: {e:?}"))?;

    mark_used(&http, fetched_entry.keypackage_id).await?;

    let welcome_bytes = welcome_out
        .to_bytes()
        .map_err(|e| anyhow!("serialize welcome message: {e:?}"))?;
    enqueue(
        &http,
        alice_dev,
        &alice_tok,
        bob_dev,
        &B64.encode(&welcome_bytes),
    )
    .await?;

    let welcome_msgs = pull(&http, bob_dev, &bob_tok).await?;
    let welcome_raw_b64 = welcome_msgs
        .first()
        .ok_or_else(|| anyhow!("no welcome delivered"))?
        .ciphertext_b64
        .clone();
    let welcome_raw = B64.decode(welcome_raw_b64.as_bytes())?;
    let mut welcome_slice = welcome_raw.as_slice();
    let welcome_in = MlsMessageIn::tls_deserialize(&mut welcome_slice)
        .map_err(|e| anyhow!("deserialize welcome message: {e:?}"))?;
    let welcome = match welcome_in.extract() {
        MlsMessageBodyIn::Welcome(w) => w,
        other => return Err(anyhow!("unexpected message body: {other:?}")),
    };

    let join_config = MlsGroupJoinConfig::default();
    let staged = StagedWelcome::new_from_welcome(&crypto, &join_config, welcome, None)
        .map_err(|e| anyhow!("staged welcome: {e:?}"))?;
    let mut bob_group = staged
        .into_group(&crypto)
        .map_err(|e| anyhow!("welcome->group: {e:?}"))?;

    let app_plain = b"hello bob (MLS)";
    let app_msg = alice_group
        .create_message(&crypto, &alice_signer, app_plain)
        .map_err(|e| anyhow!("create message: {e:?}"))?;
    let app_bytes = app_msg
        .to_bytes()
        .map_err(|e| anyhow!("serialize application message: {e:?}"))?;
    enqueue(
        &http,
        alice_dev,
        &alice_tok,
        bob_dev,
        &B64.encode(&app_bytes),
    )
    .await?;

    let app_msgs = pull(&http, bob_dev, &bob_tok).await?;
    let app_raw_b64 = app_msgs
        .first()
        .ok_or_else(|| anyhow!("no application message delivered"))?
        .ciphertext_b64
        .clone();
    let app_raw = B64.decode(app_raw_b64.as_bytes())?;
    let mut app_slice = app_raw.as_slice();
    let mls_in = MlsMessageIn::tls_deserialize(&mut app_slice)
        .map_err(|e| anyhow!("deserialize MLS message: {e:?}"))?;
    let protocol = mls_in
        .try_into_protocol_message()
        .map_err(|e| anyhow!("message into protocol: {e:?}"))?;
    let processed = bob_group
        .process_message(&crypto, protocol)
        .map_err(|e| anyhow!("process message: {e:?}"))?;

    match processed.into_content() {
        ProcessedMessageContent::ApplicationMessage(app) => {
            let body = app.into_bytes();
            println!("MLS decrypted on Bob: {}", String::from_utf8_lossy(&body));
        }
        other => return Err(anyhow!("unexpected processed message: {other:?}")),
    }

    println!("✅ MLS POC success");
    Ok(())
}

fn make_signer(identity: &str) -> (SignatureKeyPair, CredentialWithKey) {
    let cred = BasicCredential::new(identity.as_bytes().to_vec());
    let signer = SignatureKeyPair::new(CS.signature_algorithm()).expect("signer");
    let credential = cred.into();
    let cwk = CredentialWithKey {
        credential,
        signature_key: signer.public().into(),
    };
    (signer, cwk)
}

fn rand_bytes(n: usize) -> Vec<u8> {
    let mut b = vec![0u8; n];
    rand::thread_rng().fill_bytes(&mut b);
    b
}

async fn create_user(http: &Client, username: &str) -> Result<Uuid> {
    Ok(http
        .post(format!("{BASE}/api/users"))
        .header("x-admin-token", ADMIN_TOKEN)
        .json(&CreateUserReq {
            username: username.into(),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<CreateUserResp>()
        .await?
        .user_id)
}

async fn provision_device(http: &Client, user_id: Uuid) -> Result<(Uuid, String)> {
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
            platform: "desktop".into(),
            push_token: None,
        })
        .send()
        .await?
        .error_for_status()?
        .json::<ProvisionRedeemResp>()
        .await?;

    Ok((resp.device_id, resp.device_token))
}

async fn upload_kp(
    http: &Client,
    device_id: Uuid,
    device_token: &str,
    kp_bytes: &[u8],
) -> Result<Uuid> {
    let b64 = B64.encode(kp_bytes);
    Ok(http
        .post(format!("{BASE}/api/keys/upload_keypackage"))
        .header("x-device-id", device_id.to_string())
        .header("x-device-token", device_token)
        .json(&UploadKPReq {
            device_id,
            keypackage_b64: b64,
            expires_minutes: Some(60 * 24),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<UploadKPResp>()
        .await?
        .keypackage_id)
}

async fn fetch_for_user(http: &Client, user_id: Uuid) -> Result<Vec<FetchedKP>> {
    let body = serde_json::json!({
        "user_id": user_id,
        "limit": 10,
        "max_per_device": 5
    });
    Ok(http
        .post(format!("{BASE}/api/keys/fetch_for_user"))
        .json(&body)
        .send()
        .await?
        .error_for_status()?
        .json::<FetchForUserResp>()
        .await?
        .packages)
}

async fn mark_used(http: &Client, keypackage_id: Uuid) -> Result<()> {
    let resp = http
        .post(format!("{BASE}/api/keys/mark_used"))
        .json(&MarkUsedReq { keypackage_id })
        .send()
        .await?
        .error_for_status()?
        .json::<MarkUsedResp>()
        .await?;
    if !resp.ok {
        return Err(anyhow!("failed to mark keypackage used"));
    }
    Ok(())
}

async fn enqueue(
    http: &Client,
    sender_device_id: Uuid,
    sender_token: &str,
    to_device_id: Uuid,
    b64: &str,
) -> Result<()> {
    let _ = http
        .post(format!("{BASE}/api/messages/enqueue"))
        .header("x-device-id", sender_device_id.to_string())
        .header("x-device-token", sender_token)
        .json(&EnqueueReq {
            to_device_id,
            ciphertext_b64: b64.into(),
            expires_minutes: Some(60),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<EnqueueResp>()
        .await?;
    Ok(())
}

async fn pull(http: &Client, device_id: Uuid, device_token: &str) -> Result<Vec<PulledMsg>> {
    Ok(http
        .post(format!("{BASE}/api/messages/pull"))
        .header("x-device-id", device_id.to_string())
        .header("x-device-token", device_token)
        .json(&PullReq {
            device_id,
            max: Some(10),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<PullResp>()
        .await?
        .messages)
}
