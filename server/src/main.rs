mod auth;
mod routes;

use axum::{
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    routing::{get, post},
    Json, Router,
};
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use tower_http::{cors::CorsLayer, services::ServeDir};
use base64::Engine;
use rand::RngCore;
use redis::{aio::ConnectionManager, AsyncCommands};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use sqlx::{Pool, Postgres, Row};
use std::net::SocketAddr;
use time::{Duration, OffsetDateTime};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use uuid::Uuid;

const MAX_KP_PER_DEVICE: i64 = 50;

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Postgres>,
    pub redis: ConnectionManager,
}

impl axum::extract::FromRef<AppState> for Pool<Postgres> {
    fn from_ref(state: &AppState) -> Self {
        state.db.clone()
    }
}

/* ---------- Existing DTOs ---------- */
#[derive(Deserialize)]
struct CreateUserReq {
    username: String,
}

#[derive(Serialize)]
struct CreateUserResp {
    user_id: Uuid,
}

#[derive(Deserialize)]
struct CreateProvisionReq {
    user_id: Uuid,
    purpose: String,
    ttl_minutes: Option<i64>,
}

#[derive(Serialize)]
struct CreateProvisionResp {
    token: String,
    expires_at: String,
}

#[derive(Deserialize)]
struct RedeemReq {
    token: String,
    platform: String,
    push_token: Option<String>,
}

#[derive(Serialize)]
struct RedeemResp {
    user_id: Uuid,
    device_id: Uuid,
    device_token: String, // Keep for backward compatibility
    device_auth: String,  // New: use this in x-device-auth header
}

#[derive(Deserialize)]
struct EnqueueReq {
    to_device_id: Uuid,
    ciphertext_b64: String,
    expires_minutes: Option<i64>,
}

#[derive(Serialize)]
struct EnqueueResp {
    message_id: Uuid,
    queued: bool,
}

#[derive(Deserialize)]
struct PullReq {
    device_id: Uuid,
    max: Option<i64>,
}

#[derive(Serialize)]
struct PulledMessage {
    id: Uuid,
    ciphertext_b64: String,
}

#[derive(Serialize)]
struct PullResp {
    device_id: Uuid,
    messages: Vec<PulledMessage>,
}

/* ---------- NEW: Crypto DTOs ---------- */
#[derive(Deserialize)]
struct SetIdentityKeyReq {
    device_id: Uuid,
    identity_key_b64: String,
}

#[derive(Serialize)]
struct SetIdentityKeyResp {
    device_id: Uuid,
    ok: bool,
}

#[derive(Deserialize)]
struct UploadKeyPackageReq {
    device_id: Uuid,
    keypackage_b64: String,
    expires_minutes: Option<i64>,
}

#[derive(Serialize)]
struct UploadKeyPackageResp {
    keypackage_id: Uuid,
}

#[derive(Deserialize)]
struct FetchKeyPackagesReq {
    user_id: Uuid,
    limit: Option<i64>,
    max_per_device: Option<i64>,
}

#[derive(Serialize)]
struct FetchedKeyPackage {
    keypackage_id: Uuid,
    device_id: Uuid,
    keypackage_b64: String,
}

#[derive(Serialize)]
struct FetchKeyPackagesResp {
    packages: Vec<FetchedKeyPackage>,
}

#[derive(Deserialize)]
struct FetchConsumeReq {
    user_id: Uuid,
    limit: Option<i64>,
    max_per_device: Option<i64>,
}

#[derive(Serialize)]
struct FetchConsumeItem {
    keypackage_id: Uuid,
    device_id: Uuid,
    keypackage_b64: String,
}

#[derive(Serialize)]
struct FetchConsumeResp {
    items: Vec<FetchConsumeItem>,
}

#[derive(Deserialize)]
struct MarkKeyPackageUsedReq {
    keypackage_id: Uuid,
}

#[derive(Serialize)]
struct MarkKeyPackageUsedResp {
    ok: bool,
}

#[derive(Serialize)]
struct UserIdResp {
    user_id: Uuid,
}

#[derive(Serialize)]
struct DeviceIdentity {
    device_id: Uuid,
    identity_key_b64: String,
}

#[derive(Serialize)]
struct DeviceIdentitiesResp {
    identities: Vec<DeviceIdentity>,
}

fn require_admin(headers: &HeaderMap) -> Result<(), (StatusCode, String)> {
    let want = std::env::var("ADMIN_TOKEN").unwrap_or_default();
    let got = headers
        .get("x-admin-token")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    if !want.is_empty() && want == got {
        Ok(())
    } else {
        Err((
            StatusCode::UNAUTHORIZED,
            "missing or bad x-admin-token".into(),
        ))
    }
}

fn require_device(headers: &HeaderMap) -> Result<(Uuid, String), (StatusCode, String)> {
    let id = headers
        .get("x-device-id")
        .and_then(|v| v.to_str().ok())
        .ok_or((StatusCode::UNAUTHORIZED, "missing x-device-id".to_string()))?;
    let token = headers
        .get("x-device-token")
        .and_then(|v| v.to_str().ok())
        .ok_or((
            StatusCode::UNAUTHORIZED,
            "missing x-device-token".to_string(),
        ))?;
    let dev_id = Uuid::try_parse(id)
        .map_err(|_| (StatusCode::UNAUTHORIZED, "bad x-device-id".to_string()))?;
    Ok((dev_id, token.to_string()))
}

async fn verify_device_token(
    db: &Pool<Postgres>,
    dev_id: Uuid,
    token_str: &str,
) -> Result<(), (StatusCode, String)> {
    let mut hasher = Sha256::new();
    hasher.update(token_str.as_bytes());
    let token_hash = hasher.finalize().to_vec();
    let ok = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM devices WHERE id=$1 AND auth_token_hash=$2 AND revoked_at IS NULL",
    )
    .bind(dev_id)
    .bind(token_hash)
    .fetch_one(db)
    .await
    .map_err(internal)?;
    if ok == 1 {
        Ok(())
    } else {
        Err((StatusCode::UNAUTHORIZED, "invalid device token".into()))
    }
}

async fn touch_last_seen(db: &Pool<Postgres>, dev_id: Uuid) {
    let _ = sqlx::query("UPDATE devices SET last_seen_at = now() WHERE id=$1")
        .bind(dev_id)
        .execute(db)
        .await;
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "server=info,axum=warn,sqlx=warn".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url = std::env::var("DATABASE_URL")?;
    let db = sqlx::postgres::PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(std::time::Duration::from_secs(10))
        .connect(&database_url)
        .await?;

    let redis_url = std::env::var("REDIS_URL")?;
    let redis_client = redis::Client::open(redis_url)?;
    let redis = redis_client.get_connection_manager().await?;

    let state = AppState { db, redis };

    let db_for_janitor = state.db.clone();
    tokio::spawn(async move {
        loop {
            let _ = sqlx::query(
                "DELETE FROM messages WHERE expires_at IS NOT NULL AND expires_at < now()",
            )
            .execute(&db_for_janitor)
            .await;

            let _ = sqlx::query(
                "DELETE FROM provision_tokens WHERE expires_at < now() - interval '7 days'",
            )
            .execute(&db_for_janitor)
            .await;

            let _ = sqlx::query(
                "DELETE FROM mls_keypackages WHERE used_at IS NULL AND expires_at IS NOT NULL AND expires_at < now() - interval '30 days'",
            )
            .execute(&db_for_janitor)
            .await;

            tokio::time::sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    // Static file service - serves files from server/static at root paths
    // This must come AFTER API routes to avoid conflicts
    let static_service = ServeDir::new("server/static");

    let app = Router::new()
        // API routes first (more specific)
        .merge(routes::dev::router())
        .merge(routes::download::router()) // /download/macos/latest and /download/android/latest
        .merge(routes::invite::router()) // Includes /invite.html and invite APIs
        .merge(routes::auth::router()) // Includes /api/signup and /api/login
        .route("/api/friends/request", axum::routing::post(routes::friends::request_friend))
        .route("/api/friends/respond", axum::routing::post(routes::friends::respond_friend))
        .route("/api/friends/list", axum::routing::get(routes::friends::list_friends))
        .route("/api/messages/send_username", axum::routing::post(routes::messages_extra::send_username))
        .route("/api/messages/ack", axum::routing::post(routes::messages_extra::ack_messages))
        .route("/healthz", get(|| async { "ok" }))
        .route("/readyz", get(readyz))
        .route("/api/users", post(create_user))
        .route(
            "/api/users/by_username/:username",
            get(get_user_by_username),
        )
        .route("/api/provision/create", post(create_provision))
        .route("/api/provision/redeem", post(redeem_provision))
        .route("/api/messages/enqueue", post(enqueue_message))
        .route("/api/messages/pull", post(pull_messages))
        .route("/api/keys/set_identity", post(set_identity_key))
        .route("/api/keys/upload_keypackage", post(upload_keypackage))
        .route("/api/keys/fetch_for_user", post(fetch_keypackages_for_user))
        .route(
            "/api/keys/identities/:user_id",
            get(get_identities_for_user),
        )
        .route(
            "/api/keys/fetch_consume_for_user",
            post(fetch_consume_keypackages_for_user),
        )
        .route("/api/keys/mark_used", post(mark_keypackage_used))
        // Static files last (catch-all for /invite.html and other static assets)
        .nest_service("/", static_service)
        // Add CORS middleware to allow downloads from any origin
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr: SocketAddr = std::env::var("BIND_ADDR")
        .unwrap_or_else(|_| "0.0.0.0:8080".into())
        .parse()?;
    tracing::info!("listening on {}", addr);
    axum::serve(tokio::net::TcpListener::bind(addr).await?, app).await?;
    Ok(())
}

async fn readyz(State(state): State<AppState>) -> &'static str {
    let _ = sqlx::query_scalar::<_, i32>("SELECT 1")
        .fetch_one(&state.db)
        .await
        .unwrap();
    "ready"
}


async fn create_user(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<CreateUserReq>,
) -> Result<Json<CreateUserResp>, (StatusCode, String)> {
    require_admin(&headers)?;
    if body.username.trim().is_empty() {
        return Err((StatusCode::BAD_REQUEST, "username required".into()));
    }

    let rec = sqlx::query_scalar::<_, Uuid>(
        r#"INSERT INTO users(username) VALUES ($1)
           ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
           RETURNING id"#,
    )
    .bind(body.username.trim())
    .fetch_one(&state.db)
    .await
    .map_err(internal)?;

    Ok(Json(CreateUserResp { user_id: rec }))
}

async fn create_provision(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<CreateProvisionReq>,
) -> Result<Json<CreateProvisionResp>, (StatusCode, String)> {
    require_admin(&headers)?;
    let exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users WHERE id=$1")
        .bind(body.user_id)
        .fetch_one(&state.db)
        .await
        .map_err(internal)?;

    if exists == 0 {
        return Err((StatusCode::BAD_REQUEST, "unknown user_id".into()));
    }

    let mut raw = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut raw);
    let token = URL_SAFE_NO_PAD.encode(&raw);

    let mut hasher = Sha256::new();
    hasher.update(token.as_bytes());
    let token_hash = hasher.finalize().to_vec();

    let ttl = body.ttl_minutes.unwrap_or(30);
    let expires_at = OffsetDateTime::now_utc() + Duration::minutes(ttl);

    sqlx::query(
        r#"INSERT INTO provision_tokens (user_id, purpose, token_hash, expires_at)
           VALUES ($1,$2,$3,$4)"#,
    )
    .bind(body.user_id)
    .bind(body.purpose)
    .bind(token_hash)
    .bind(expires_at)
    .execute(&state.db)
    .await
    .map_err(internal)?;

    Ok(Json(CreateProvisionResp {
        token,
        expires_at: expires_at
            .format(&time::format_description::well_known::Rfc3339)
            .unwrap(),
    }))
}

async fn redeem_provision(
    State(state): State<AppState>,
    Json(body): Json<RedeemReq>,
) -> Result<Json<RedeemResp>, (StatusCode, String)> {
    tracing::info!("🎫 [PROVISION] ========== PROVISION REDEEM REQUEST RECEIVED ==========");
    tracing::info!("🎫 [PROVISION] Platform: {:?}", body.platform);
    tracing::info!("🎫 [PROVISION] Token length: {} chars", body.token.len());
    tracing::info!("🎫 [PROVISION] Push token: {:?}", body.push_token);
    
    let mut hasher = Sha256::new();
    hasher.update(body.token.as_bytes());
    let token_hash = hasher.finalize().to_vec();
    tracing::info!("🎫 [PROVISION] Token hash computed: {} bytes", token_hash.len());

    tracing::info!("🎫 [PROVISION] Starting database transaction...");
    let mut tx = state.db.begin().await.map_err(|e| {
        tracing::error!("🎫 [PROVISION] ❌ Failed to begin transaction: {}", e);
        internal(e)
    })?;

    #[derive(sqlx::FromRow)]
    struct TokenRow {
        id: Uuid,
        user_id: Uuid,
        inviter_username: Option<String>,
    }

    tracing::info!("🎫 [PROVISION] Querying provision_tokens table...");
    let row = sqlx::query_as::<_, TokenRow>(
        r#"SELECT id, user_id, inviter_username FROM provision_tokens
           WHERE token_hash=$1 AND used_at IS NULL AND expires_at > now()
           FOR UPDATE"#,
    )
    .bind(token_hash)
    .fetch_optional(&mut *tx)
    .await
    .map_err(|e| {
        tracing::error!("🎫 [PROVISION] ❌ Database query failed: {}", e);
        internal(e)
    })?;

    let (token_id, user_id, inviter_username) = match row {
        Some(r) => {
            tracing::info!("🎫 [PROVISION] ✅ Token found: id={}, user_id={}, inviter={:?}", 
                r.id, r.user_id, r.inviter_username);
            (r.id, r.user_id, r.inviter_username)
        },
        None => {
            tracing::warn!("🎫 [PROVISION] ❌ Token not found or expired/invalid");
            return Err((StatusCode::UNAUTHORIZED, "invalid or expired token".into()));
        },
    };

    tracing::info!("🎫 [PROVISION] Marking token as used...");
    sqlx::query("UPDATE provision_tokens SET used_at = now() WHERE id=$1")
        .bind(token_id)
        .execute(&mut *tx)
        .await
        .map_err(|e| {
            tracing::error!("🎫 [PROVISION] ❌ Failed to mark token as used: {}", e);
            internal(e)
        })?;

    // Auto-friend: If this token has an inviter, create a friendship
    if let Some(ref inviter) = inviter_username {
        // Find inviter's user_id
        if let Some(inviter_user_id) = sqlx::query_scalar::<_, Uuid>(
            "SELECT id FROM users WHERE username = $1"
        )
        .bind(inviter)
        .fetch_optional(&mut *tx)
        .await
        .map_err(internal)?
        {
            // Create friendship: new user (user_id) requests inviter (inviter_user_id)
            // Status: accepted (auto-accept since it's an invite)
            sqlx::query!(
                r#"
                INSERT INTO friendships (requester, addressee, status, created_at)
                VALUES ($1, $2, 'accepted', now())
                ON CONFLICT (requester, addressee) DO NOTHING
                "#,
                user_id,
                inviter_user_id
            )
            .execute(&mut *tx)
            .await
            .map_err(internal)?;
        }
    }

    tracing::info!("🎫 [PROVISION] Creating device for user_id: {}", user_id);
    let device_id = sqlx::query_scalar::<_, Uuid>(
        r#"INSERT INTO devices (user_id, platform, push_token)
           VALUES ($1,$2,$3)
           RETURNING id"#,
    )
    .bind(user_id)
    .bind(body.platform)
    .bind(body.push_token)
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| {
        tracing::error!("🎫 [PROVISION] ❌ Failed to create device: {}", e);
        internal(e)
    })?;
    
    tracing::info!("🎫 [PROVISION] ✅ Device created: {}", device_id);

    tracing::info!("🎫 [PROVISION] Generating device auth token...");
    let mut raw_tok = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut raw_tok);
    let token_str = URL_SAFE_NO_PAD.encode(raw_tok);
    let mut th = Sha256::new();
    th.update(token_str.as_bytes());
    let token_hash = th.finalize().to_vec();

    tracing::info!("🎫 [PROVISION] Updating device with auth token hash...");
    sqlx::query!(
        "UPDATE devices SET auth_token_hash=$1, token_created_at=now() WHERE id=$2",
        token_hash,
        device_id
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| {
        tracing::error!("🎫 [PROVISION] ❌ Failed to update device token: {}", e);
        internal(e)
    })?;

    tracing::info!("🎫 [PROVISION] Committing transaction...");
    tx.commit().await.map_err(|e| {
        tracing::error!("🎫 [PROVISION] ❌ Failed to commit transaction: {}", e);
        internal(e)
    })?;
    
    tracing::info!("🎫 [PROVISION] ✅ Provision redeem completed successfully");
    tracing::info!("🎫 [PROVISION] ========== PROVISION REDEEM REQUEST COMPLETED ==========");

    tracing::info!("🎫 [PROVISION] Preparing response...");
    let response = RedeemResp {
        user_id,
        device_id,
        device_token: token_str.clone(), // Backward compatibility
        device_auth: token_str.clone(),  // New field
    };
    
    tracing::info!("🎫 [PROVISION] Response: user_id={}, device_id={}, token_length={}", 
        response.user_id, response.device_id, response.device_auth.len());
    tracing::info!("🎫 [PROVISION] ========== PROVISION REDEEM REQUEST COMPLETED ==========");
    
    Ok(Json(response))
}

async fn enqueue_message(
    State(state): State<AppState>,
    auth: crate::auth::DeviceAuth,
    Json(body): Json<EnqueueReq>,
) -> Result<Json<EnqueueResp>, (StatusCode, String)> {

    let exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM devices WHERE id=$1")
        .bind(body.to_device_id)
        .fetch_one(&state.db)
        .await
        .map_err(internal)?;

    if exists == 0 {
        return Err((StatusCode::BAD_REQUEST, "unknown to_device_id".into()));
    }

    let ciphertext = URL_SAFE_NO_PAD
        .decode(body.ciphertext_b64.as_bytes())
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("bad base64: {e}")))?;

    let exp = body.expires_minutes.unwrap_or(7 * 24 * 60);
    let expires_at = OffsetDateTime::now_utc() + Duration::minutes(exp);

    let msg_id = sqlx::query_scalar::<_, Uuid>(
        r#"INSERT INTO messages (to_device_id, ciphertext, expires_at)
           VALUES ($1,$2,$3)
           RETURNING id"#,
    )
    .bind(body.to_device_id)
    .bind(ciphertext)
    .bind(expires_at)
    .fetch_one(&state.db)
    .await
    .map_err(internal)?;

    let list_key = format!("q:{}", body.to_device_id);
    let chan = format!("ch:{}", body.to_device_id);
    let mut r = state.redis.clone();
    let _: Result<i64, _> = r.lpush(list_key, msg_id.to_string()).await;
    let _: Result<i64, _> = r.publish(chan, "1").await;

    touch_last_seen(&state.db, auth.device_id).await;

    Ok(Json(EnqueueResp {
        message_id: msg_id,
        queued: true,
    }))
}

async fn pull_messages(
    State(state): State<AppState>,
    auth: crate::auth::DeviceAuth,
) -> Result<Json<PullResp>, (StatusCode, String)> {
    let max = 50i64;

    // Pull messages WITHOUT deleting
    let rows = sqlx::query(
        r#"
        SELECT m.id, m.ciphertext
        FROM messages m
        WHERE m.to_device_id = $1
          AND (m.expires_at IS NULL OR m.expires_at > now())
        ORDER BY m.created_at
        LIMIT $2
        "#,
    )
    .bind(auth.device_id)
    .bind(max)
    .fetch_all(&state.db)
    .await
    .map_err(internal)?;

    let messages = rows
        .into_iter()
        .map(|row| {
            let id: Uuid = row.try_get("id").unwrap();
            let bytes: Vec<u8> = row.try_get("ciphertext").unwrap();
            let b64 = URL_SAFE_NO_PAD.encode(bytes);
            PulledMessage {
                id,
                ciphertext_b64: b64,
            }
        })
        .collect();

    touch_last_seen(&state.db, auth.device_id).await;

    Ok(Json(PullResp {
        device_id: auth.device_id,
        messages,
    }))
}

async fn set_identity_key(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<SetIdentityKeyReq>,
) -> Result<Json<SetIdentityKeyResp>, (StatusCode, String)> {
    let (hdr_dev, tok) = require_device(&headers)?;
    if hdr_dev != body.device_id {
        return Err((StatusCode::UNAUTHORIZED, "device mismatch".into()));
    }
    verify_device_token(&state.db, hdr_dev, &tok).await?;

    let bytes = URL_SAFE_NO_PAD
        .decode(body.identity_key_b64.as_bytes())
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("bad base64: {e}")))?;

    if bytes.len() != 32 {
        return Err((
            StatusCode::BAD_REQUEST,
            "identity_key must be 32 bytes".into(),
        ));
    }

    let updated = sqlx::query("UPDATE devices SET identity_key_pub=$1 WHERE id=$2")
        .bind(bytes)
        .bind(body.device_id)
        .execute(&state.db)
        .await
        .map_err(internal)?;

    if updated.rows_affected() == 0 {
        return Err((StatusCode::BAD_REQUEST, "unknown device_id".into()));
    }

    touch_last_seen(&state.db, hdr_dev).await;

    Ok(Json(SetIdentityKeyResp {
        device_id: body.device_id,
        ok: true,
    }))
}

async fn upload_keypackage(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(body): Json<UploadKeyPackageReq>,
) -> Result<Json<UploadKeyPackageResp>, (StatusCode, String)> {
    let (hdr_dev, tok) = require_device(&headers)?;
    if hdr_dev != body.device_id {
        return Err((StatusCode::UNAUTHORIZED, "device mismatch".into()));
    }
    verify_device_token(&state.db, hdr_dev, &tok).await?;

    let exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM devices WHERE id=$1")
        .bind(body.device_id)
        .fetch_one(&state.db)
        .await
        .map_err(internal)?;

    if exists == 0 {
        return Err((StatusCode::BAD_REQUEST, "unknown device_id".into()));
    }

    let count = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM mls_keypackages WHERE device_id=$1 AND used_at IS NULL AND (expires_at IS NULL OR expires_at > now())",
    )
    .bind(body.device_id)
    .fetch_one(&state.db)
    .await
    .map_err(internal)?;

    if count >= MAX_KP_PER_DEVICE {
        return Err((
            StatusCode::TOO_MANY_REQUESTS,
            format!("quota exceeded ({MAX_KP_PER_DEVICE})"),
        ));
    }

    let kp_bytes = URL_SAFE_NO_PAD
        .decode(body.keypackage_b64.as_bytes())
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("bad base64: {e}")))?;

    let expires_at = body
        .expires_minutes
        .map(|m| OffsetDateTime::now_utc() + Duration::minutes(m));

    let kp_id = sqlx::query_scalar::<_, Uuid>(
        r#"INSERT INTO mls_keypackages (device_id, keypackage, expires_at)
           VALUES ($1,$2,$3)
           RETURNING id"#,
    )
    .bind(body.device_id)
    .bind(kp_bytes)
    .bind(expires_at)
    .fetch_one(&state.db)
    .await
    .map_err(internal)?;

    touch_last_seen(&state.db, hdr_dev).await;

    Ok(Json(UploadKeyPackageResp {
        keypackage_id: kp_id,
    }))
}

async fn fetch_keypackages_for_user(
    State(state): State<AppState>,
    Json(body): Json<FetchKeyPackagesReq>,
) -> Result<Json<FetchKeyPackagesResp>, (StatusCode, String)> {
    let limit = body.limit.unwrap_or(10).clamp(1, 100) as i64;

    let device_rows =
        sqlx::query("SELECT id FROM devices WHERE user_id = $1 AND revoked_at IS NULL")
            .bind(body.user_id)
            .fetch_all(&state.db)
            .await
            .map_err(internal)?;

    if device_rows.is_empty() {
        return Ok(Json(FetchKeyPackagesResp { packages: vec![] }));
    }

    let max_per_device = body.max_per_device.unwrap_or(5).clamp(1, 50) as i64;
    let mut items = Vec::new();

    'outer: for drow in device_rows {
        let dev_id: Uuid = drow.try_get("id").unwrap();
        let rows = sqlx::query(
            r#"
            SELECT id, keypackage
            FROM mls_keypackages
            WHERE device_id=$1 AND used_at IS NULL AND (expires_at IS NULL OR expires_at > now())
            ORDER BY created_at DESC
            LIMIT $2
            "#,
        )
        .bind(dev_id)
        .bind(max_per_device)
        .fetch_all(&state.db)
        .await
        .map_err(internal)?;

        for r in rows {
            let kp_id: Uuid = r.try_get("id").unwrap();
            let kp_bytes: Vec<u8> = r.try_get("keypackage").unwrap();
            let kp_b64 = URL_SAFE_NO_PAD.encode(kp_bytes);
            items.push(FetchedKeyPackage {
                keypackage_id: kp_id,
                device_id: dev_id,
                keypackage_b64: kp_b64,
            });

            if items.len() as i64 >= limit {
                break 'outer;
            }
        }
    }

    Ok(Json(FetchKeyPackagesResp { packages: items }))
}

async fn fetch_consume_keypackages_for_user(
    State(state): State<AppState>,
    Json(body): Json<FetchConsumeReq>,
) -> Result<Json<FetchConsumeResp>, (StatusCode, String)> {
    let limit = body.limit.unwrap_or(10).clamp(1, 100) as i64;
    let max_per_device = body.max_per_device.unwrap_or(5).clamp(1, 50) as i64;

    let mut tx = state.db.begin().await.map_err(internal)?;

    let devices = sqlx::query_scalar::<_, Uuid>(
        "SELECT id FROM devices WHERE user_id=$1 AND revoked_at IS NULL",
    )
    .bind(body.user_id)
    .fetch_all(&mut *tx)
    .await
    .map_err(internal)?;

    let mut items = Vec::new();

    for dev in devices {
        let rows = sqlx::query(
            r#"
            SELECT id, keypackage
            FROM mls_keypackages
            WHERE device_id=$1
              AND used_at IS NULL
              AND (expires_at IS NULL OR expires_at > now())
            ORDER BY created_at DESC
            LIMIT $2
            FOR UPDATE SKIP LOCKED
            "#,
        )
        .bind(dev)
        .bind(max_per_device)
        .fetch_all(&mut *tx)
        .await
        .map_err(internal)?;

        for row in rows {
            let kp_id: Uuid = row.try_get("id").unwrap();
            let kp_bytes: Vec<u8> = row.try_get("keypackage").unwrap();
            let kp_b64 = URL_SAFE_NO_PAD.encode(kp_bytes);
            items.push(FetchConsumeItem {
                keypackage_id: kp_id,
                device_id: dev,
                keypackage_b64: kp_b64,
            });
            if items.len() as i64 >= limit {
                break;
            }
        }

        if items.len() as i64 >= limit {
            break;
        }
    }

    if !items.is_empty() {
        let ids: Vec<Uuid> = items.iter().map(|item| item.keypackage_id).collect();
        sqlx::query(
            "UPDATE mls_keypackages SET used_at = now() WHERE id = ANY($1) AND used_at IS NULL",
        )
        .bind(&ids)
        .execute(&mut *tx)
        .await
        .map_err(internal)?;
    }

    tx.commit().await.map_err(internal)?;

    Ok(Json(FetchConsumeResp { items }))
}

async fn mark_keypackage_used(
    State(state): State<AppState>,
    Json(body): Json<MarkKeyPackageUsedReq>,
) -> Result<Json<MarkKeyPackageUsedResp>, (StatusCode, String)> {
    let result = sqlx::query(
        r#"UPDATE mls_keypackages
           SET used_at = now()
           WHERE id = $1 AND used_at IS NULL"#,
    )
    .bind(body.keypackage_id)
    .execute(&state.db)
    .await
    .map_err(internal)?;

    Ok(Json(MarkKeyPackageUsedResp {
        ok: result.rows_affected() == 1,
    }))
}

async fn get_user_by_username(
    State(state): State<AppState>,
    Path(username): Path<String>,
) -> Result<Json<UserIdResp>, StatusCode> {
    let rec = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users WHERE username=$1")
        .bind(username.trim())
        .fetch_optional(&state.db)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match rec {
        Some(id) => Ok(Json(UserIdResp { user_id: id })),
        None => Err(StatusCode::NOT_FOUND),
    }
}

async fn get_identities_for_user(
    State(state): State<AppState>,
    Path(user_id): Path<Uuid>,
) -> Result<Json<DeviceIdentitiesResp>, StatusCode> {
    let rows = sqlx::query(
        r#"
        SELECT id, identity_key_pub
        FROM devices
        WHERE user_id=$1
          AND revoked_at IS NULL
          AND identity_key_pub IS NOT NULL
        ORDER BY created_at ASC
        "#,
    )
    .bind(user_id)
    .fetch_all(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let identities = rows
        .into_iter()
        .filter_map(|row| {
            let device_id: Uuid = row.try_get("id").ok()?;
            let bytes: Vec<u8> = row.try_get("identity_key_pub").ok()?;
            Some(DeviceIdentity {
                device_id,
                identity_key_b64: URL_SAFE_NO_PAD.encode(bytes),
            })
        })
        .collect();

    Ok(Json(DeviceIdentitiesResp { identities }))
}

fn internal<E: std::fmt::Display>(e: E) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, e.to_string())
}
