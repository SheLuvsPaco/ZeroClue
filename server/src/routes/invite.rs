use axum::{
    extract::{Query, State},
    http::{header, HeaderMap, StatusCode},
    response::{Html, IntoResponse},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;
use tokio::fs;
use uuid::Uuid;

use crate::auth::DeviceAuth;
use crate::AppState;

#[derive(Deserialize)]
pub struct CreateInviteReq {
    #[allow(dead_code)] // Kept for future use
    pub friend_hint: Option<String>,
    pub ttl_minutes: Option<i64>,
}

#[derive(Serialize)]
pub struct CreateInviteResp {
    pub invite_link: String, // Single unified invite link
}

#[derive(Serialize)]
pub struct MeResp {
    pub username: String,
    pub device_id: Uuid,
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/invite/create", post(create_invite))
        .route("/download/latest", get(download_latest))
        .route("/api/me", get(get_me))
        .route("/invite.html", get(serve_invite_page))
}

async fn create_invite(
    State(state): State<AppState>,
    auth: DeviceAuth,
    headers: axum::http::HeaderMap,
    Json(body): Json<CreateInviteReq>,
) -> Result<(StatusCode, Json<CreateInviteResp>), (StatusCode, String)> {
    use base64::engine::general_purpose::URL_SAFE_NO_PAD;
    use base64::Engine;
    use rand::RngCore;
    use sha2::{Digest, Sha256};
    use time::{Duration, OffsetDateTime};
    use urlencoding::encode;

    // Get base URL from env, header, or try to detect local network IP
    let base_url = std::env::var("BASE_PUBLIC_URL")
        .ok()
        .or_else(|| {
            headers
                .get("x-base-url")
                .and_then(|h| h.to_str().ok())
                .map(|s| s.to_string())
        })
        .or_else(|| {
            // Try to detect local network IP
            detect_local_ip().map(|ip| format!("http://{}:8080", ip))
        })
        .unwrap_or_else(|| "http://127.0.0.1:8080".to_string());

    // Get current user's username (the inviter)
    let inviter_username: String = sqlx::query_scalar!(
        "SELECT username FROM users WHERE id = $1",
        auth.user_id
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .ok_or_else(|| (StatusCode::INTERNAL_SERVER_ERROR, "inviter user not found".to_string()))?;

    // Create a new anonymous user for the invitee (will be set during signup)
    let invitee_user_id: Uuid = sqlx::query_scalar::<_, Uuid>(
        "INSERT INTO users (username) VALUES ('invitee_' || gen_random_uuid()::text) RETURNING id",
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // Generate provision token
    let mut raw = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut raw);
    let token_str = URL_SAFE_NO_PAD.encode(&raw);

    let mut hasher = Sha256::new();
    hasher.update(token_str.as_bytes());
    let token_hash = hasher.finalize().to_vec();

    let ttl = body.ttl_minutes.unwrap_or(60);
    let expires_at = OffsetDateTime::now_utc() + Duration::minutes(ttl);

    // Store provision token with inviter username for auto-friending
    sqlx::query!(
        r#"
        INSERT INTO provision_tokens (user_id, purpose, token_hash, expires_at, inviter_username)
        VALUES ($1, 'install', $2, $3, $4)
        "#,
        invitee_user_id,
        token_hash,
        expires_at,
        inviter_username
    )
    .execute(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // Build landing URL (single invite link)
    let landing = format!("{}/invite.html?token={}&base={}&inviter={}", 
        base_url, 
        encode(&token_str), 
        encode(&base_url),
        encode(&inviter_username)
    );

    Ok((
        StatusCode::CREATED,
        Json(CreateInviteResp { 
            invite_link: landing, // Return the landing page URL as the single invite link
        }),
    ))
}

// Helper to detect local network IP
fn detect_local_ip() -> Option<String> {
    // Try to connect to a dummy UDP socket to detect local IP
    let socket = std::net::UdpSocket::bind("0.0.0.0:0").ok()?;
    socket.connect("8.8.8.8:80").ok()?;
    let local_addr = socket.local_addr().ok()?;
    Some(local_addr.ip().to_string())
}

// Serve invite.html with template variables filled in
async fn serve_invite_page(
    Query(params): Query<HashMap<String, String>>,
) -> Result<(HeaderMap, Html<String>), (StatusCode, &'static str)> {
    let token = params.get("token").map(|s| s.as_str()).unwrap_or("");
    let base = params.get("base")
        .map(|s| s.as_str())
        .unwrap_or("http://127.0.0.1:8080");
    let inviter = params.get("inviter").map(|s| s.as_str()).unwrap_or("");

    // Log for tracing
    let token_prefix = if token.len() > 8 {
        &token[..8]
    } else {
        token
    };
    tracing::info!("Serving invite page: token={}..., base={}, inviter={}", token_prefix, base, inviter);

    // Read the template
    let template = tokio::fs::read_to_string("server/static/invite.html")
        .await
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to read invite template"))?;

    // Replace template variables
    let inviter_part = if inviter.is_empty() {
        String::new()
    } else {
        format!("&inviter={}", urlencoding::encode(inviter))
    };
    let html = template
        .replace("{{TOKEN}}", &urlencoding::encode(token))
        .replace("{{BASE}}", &urlencoding::encode(base))
        .replace("{{INVITER_PART}}", &inviter_part);

    // Add no-store cache control for invite page
    let mut headers = HeaderMap::new();
    headers.insert(
        header::CACHE_CONTROL,
        "no-store, no-cache, must-revalidate"
            .parse()
            .unwrap(),
    );

    Ok((headers, Html(html)))
}

// Download latest app installer - simple, robust handler
async fn download_latest() -> Result<(HeaderMap, Vec<u8>), (StatusCode, Json<serde_json::Value>)> {
    use axum::http::header::{CACHE_CONTROL, CONTENT_DISPOSITION, CONTENT_TYPE};
    use std::path::Path;
    
    let p = Path::new("server/static/downloads/macos/ZeroChat-latest.dmg");
    
    // Resolve absolute path for logging
    let abs_path = match std::fs::canonicalize(p) {
        Ok(path) => path,
        Err(_) => {
            // If canonicalize fails, try to get absolute path another way
            let current_dir = std::env::current_dir().unwrap_or_else(|_| Path::new(".").to_path_buf());
            current_dir.join(p)
        }
    };
    
    if !p.exists() {
        tracing::warn!("DMG not found at absolute path: {}", abs_path.display());
        return Err((
            StatusCode::NOT_FOUND,
            Json(serde_json::json!({
                "error": "Installer not found",
                "path": abs_path.display().to_string()
            })),
        ));
    }
    
    let bytes = tokio::fs::read(p)
        .await
        .map_err(|e| {
            tracing::error!("Failed to read DMG at {}: {}", abs_path.display(), e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to read installer file"
                })),
            )
        })?;
    
    let mut h = HeaderMap::new();
    h.insert(CONTENT_TYPE, "application/x-apple-diskimage".parse().unwrap());
    h.insert(
        CONTENT_DISPOSITION,
        "attachment; filename=\"ZeroChat.dmg\"".parse().unwrap(),
    );
    h.insert(CACHE_CONTROL, "public, max-age=3600".parse().unwrap());
    h.insert(
        header::CONTENT_LENGTH,
        bytes.len().to_string().parse().unwrap(),
    );
    
    tracing::info!(
        "Serving DMG: {} ({} bytes, {} MB)",
        abs_path.display(),
        bytes.len(),
        bytes.len() / 1_000_000
    );
    
    Ok((h, bytes))
}

async fn get_me(
    State(state): State<AppState>,
    auth: DeviceAuth,
) -> Result<Json<MeResp>, (StatusCode, String)> {
    let username: Option<String> = sqlx::query_scalar!(
        "SELECT username FROM users WHERE id = $1",
        auth.user_id
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let username = username
        .ok_or_else(|| (StatusCode::NOT_FOUND, "user not found".into()))?;

    Ok(Json(MeResp {
        username,
        device_id: auth.device_id,
    }))
}
