use axum::{
    extract::State,
    http::StatusCode,
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::auth::DeviceAuth;
use crate::AppState;

#[derive(Deserialize)]
pub struct SendByUsernameReq {
    pub to_username: String,
    pub ciphertext_b64: String,
    pub expires_at: Option<String>, // Optional ISO8601
}

#[derive(Serialize)]
pub struct SendByUsernameResp {
    pub queued: bool,
    pub count: i64,
}

#[derive(Deserialize)]
pub struct AckMessagesReq {
    pub ids: Vec<Uuid>,
}

#[derive(Serialize)]
pub struct PullMessagesResp {
    pub messages: Vec<PulledMessage>,
}

#[derive(Serialize)]
pub struct PulledMessage {
    pub id: Uuid,
    pub ciphertext_b64: String,
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/messages/send_username", post(send_username))
        .route("/api/messages/ack", post(ack_messages))
}

pub async fn send_username(
    State(state): State<AppState>,
    auth: DeviceAuth,
    Json(body): Json<SendByUsernameReq>,
) -> Result<(StatusCode, Json<SendByUsernameResp>), (StatusCode, String)> {
    let to_username = body.to_username.to_lowercase().trim().to_string();
    if to_username.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "username required".into()));
    }

    // Get recipient user_id
    let recipient_id: Option<Uuid> = sqlx::query_scalar!(
        "SELECT id FROM users WHERE username = $1",
        to_username
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let recipient_id = recipient_id
        .ok_or_else(|| (StatusCode::NOT_FOUND, "user not found".into()))?;

    // Get ALL recipient's active devices
    #[derive(sqlx::FromRow)]
    struct DeviceRow {
        id: Uuid,
    }
    let devices: Vec<DeviceRow> = sqlx::query_as(
        r#"
        SELECT id FROM devices
        WHERE user_id = $1 AND revoked_at IS NULL
        "#,
    )
    .bind(recipient_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if devices.is_empty() {
        return Err((
            StatusCode::NOT_FOUND,
            "recipient has no active device".into(),
        ));
    }

    // Decode ciphertext
    use base64::engine::general_purpose::URL_SAFE_NO_PAD;
    use base64::Engine;
    let ciphertext = URL_SAFE_NO_PAD
        .decode(body.ciphertext_b64.as_bytes())
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("bad base64: {e}")))?;

    // Parse expiration
    use time::{Duration, OffsetDateTime};
    let expires_at = if let Some(ref exp_str) = body.expires_at {
        OffsetDateTime::parse(exp_str, &time::format_description::well_known::Rfc3339)
            .map_err(|e| (StatusCode::BAD_REQUEST, format!("bad expires_at: {e}")))?
    } else {
        OffsetDateTime::now_utc() + Duration::days(7)
    };

    // Insert message for each device
    let mut count = 0i64;
    for device in devices {
        sqlx::query!(
            r#"
            INSERT INTO messages (to_device_id, ciphertext, expires_at)
            VALUES ($1, $2, $3)
            "#,
            device.id,
            ciphertext,
            expires_at
        )
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        count += 1;
    }

    Ok((
        StatusCode::CREATED,
        Json(SendByUsernameResp {
            queued: true,
            count,
        }),
    ))
}

pub async fn ack_messages(
    State(state): State<AppState>,
    auth: DeviceAuth,
    Json(body): Json<AckMessagesReq>,
) -> Result<StatusCode, (StatusCode, String)> {
    if body.ids.is_empty() {
        return Ok(StatusCode::OK);
    }

    // Verify messages belong to this device and delete them
    let mut tx = state.db.begin().await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("db transaction: {e}"),
        )
    })?;

    // Insert receipts for all message IDs
    for msg_id in &body.ids {
        sqlx::query!(
            r#"
            INSERT INTO message_receipts (message_id, delivered_at)
            SELECT $1, now()
            FROM messages m
            WHERE m.id = $1 AND m.to_device_id = $2
            ON CONFLICT (message_id) DO NOTHING
            "#,
            msg_id,
            auth.device_id
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    }

    // Delete messages
    sqlx::query!(
        r#"
        DELETE FROM messages
        WHERE id = ANY($1) AND to_device_id = $2
        "#,
        &body.ids[..],
        auth.device_id
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    tx.commit().await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("commit: {e}"),
        )
    })?;

    Ok(StatusCode::OK)
}


