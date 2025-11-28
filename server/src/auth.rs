use axum::http::{HeaderMap, StatusCode};

pub fn require_admin(headers: &HeaderMap) -> Result<(), (StatusCode, String)> {
    if std::env::var("DEV_MODE").ok().as_deref() != Some("true") {
        return Err((StatusCode::FORBIDDEN, "dev mode disabled".into()));
    }
    let want = std::env::var("ADMIN_TOKEN").unwrap_or_default();
    let got = headers
        .get("x-admin-token")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");
    if want.is_empty() || got != want {
        return Err((
            StatusCode::UNAUTHORIZED,
            "missing or bad x-admin-token".into(),
        ));
    }
    Ok(())
}

use axum::{
    async_trait,
    extract::{FromRequestParts, FromRef},
    http::request::Parts,
};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::AppState;

pub struct DeviceAuth {
    pub device_id: Uuid,
    pub user_id: Uuid,
}

#[async_trait]
impl<S> FromRequestParts<S> for DeviceAuth
where
    S: Send + Sync,
    AppState: FromRef<S>,
{
    type Rejection = (axum::http::StatusCode, &'static str);

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        use axum::http::StatusCode;
        let did = parts
            .headers
            .get("x-device-id")
            .and_then(|h| h.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, "missing x-device-id"))?;
        let tok = parts
            .headers
            .get("x-device-auth")
            .and_then(|h| h.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, "missing x-device-auth"))?;
        let device_id = Uuid::parse_str(did)
            .map_err(|_| (StatusCode::UNAUTHORIZED, "bad device id"))?;
        // Hash the opaque token (simple sha256 for now; swap to argon2 if desired)
        let mut hasher = Sha256::new();
        hasher.update(tok.as_bytes());
        let token_hash = hasher.finalize().to_vec();

        let app_state = AppState::from_ref(state);
        let db = &app_state.db;

        #[derive(sqlx::FromRow)]
        struct Row {
            user_id: Uuid,
        }
        let row = sqlx::query_as::<_, Row>(
            "SELECT user_id FROM devices WHERE id=$1 AND auth_token_hash=$2 AND revoked_at IS NULL",
        )
        .bind(device_id)
        .bind(token_hash)
        .fetch_optional(db)
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "db"))?;

        let user_id = row
            .ok_or((StatusCode::UNAUTHORIZED, "invalid token"))?
            .user_id;
        Ok(DeviceAuth { device_id, user_id })
    }
}
