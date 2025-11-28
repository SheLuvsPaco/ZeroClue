use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Json, Router,
};
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::auth;
use crate::AppState;

#[derive(Deserialize)]
pub struct DevProvisionIn {
    pub username: String,
    pub platform: Option<String>,
}

#[derive(Serialize)]
pub struct DevProvisionOut {
    pub user_id: Uuid,
    pub device_id: Uuid,
    pub device_token: String,
}

pub fn router() -> Router<AppState> {
    Router::new().route("/api/dev/provision_direct", post(dev_provision_direct))
}

async fn dev_provision_direct(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(inp): Json<DevProvisionIn>,
) -> Result<(StatusCode, Json<DevProvisionOut>), (StatusCode, String)> {
    auth::require_admin(&headers)?;

    let uname = inp.username.to_lowercase().trim().to_string();
    if uname.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "username required".into()));
    }

    let platform = inp.platform.unwrap_or_else(|| "desktop_dev".into());

    let user_id: Uuid = sqlx::query_scalar!(
        r#"
        INSERT INTO users (username)
        VALUES ($1)
        ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
        RETURNING id
        "#,
        uname
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let mut raw = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut raw);
    let device_token = URL_SAFE_NO_PAD.encode(&raw);

    let mut h = Sha256::new();
    h.update(device_token.as_bytes());
    let token_hash = h.finalize().to_vec();

    let device_id: Uuid = sqlx::query_scalar!(
        r#"
        INSERT INTO devices (user_id, platform, auth_token_hash, created_at)
        VALUES ($1, $2, $3, now())
        RETURNING id
        "#,
        user_id,
        platform,
        token_hash
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((
        StatusCode::CREATED,
        Json(DevProvisionOut {
            user_id,
            device_id,
            device_token,
        }),
    ))
}
