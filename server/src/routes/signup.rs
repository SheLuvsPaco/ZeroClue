use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use rand::{distributions::Alphanumeric, Rng};
use regex::Regex;
use crate::AppState;

#[derive(Deserialize)]
pub struct Req {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct Resp {
    pub provision_token: String,
}

pub async fn signup(
    State(state): State<AppState>,
    Json(req): Json<Req>,
) -> Result<Json<Resp>, (axum::http::StatusCode, String)> {
    let uname = req.username.to_lowercase();
    let re = Regex::new("^[a-z0-9_]{3,24}$").unwrap();
    if !re.is_match(&uname) {
        return Err((axum::http::StatusCode::BAD_REQUEST, "bad username".to_string()));
    }

    // Validate password length
    if req.password.len() < 8 {
        return Err((axum::http::StatusCode::BAD_REQUEST, "password must be at least 8 characters".to_string()));
    }

    // Hash password with SHA256 (consider upgrading to Argon2/BCrypt in production)
    use sha2::{Digest, Sha256};
    let mut hasher = Sha256::new();
    hasher.update(req.password.as_bytes());
    let password_hash = hasher.finalize().to_vec();

    // Check if user already exists
    #[derive(sqlx::FromRow)]
    struct UserRow {
        id: uuid::Uuid,
        password_hash: Option<Vec<u8>>,
    }
    
    let existing_user: Option<UserRow> = sqlx::query_as(
        "SELECT id, password_hash FROM users WHERE username = $1"
    )
    .bind(&uname)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

    let uid = if let Some(user) = existing_user {
        // User exists - check if password matches
        if let Some(ref hash) = user.password_hash {
            // User has password - verify it matches (compare byte slices)
            if hash.as_slice() == password_hash.as_slice() {
                // Password matches - allow login
                user.id
            } else {
                // Password doesn't match
                return Err((axum::http::StatusCode::UNAUTHORIZED, "invalid password".to_string()));
            }
        } else {
            // User exists but no password - update with new password
            sqlx::query("UPDATE users SET password_hash = $1 WHERE id = $2")
                .bind(&password_hash)
                .bind(user.id)
                .execute(&state.db)
                .await
                .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;
            user.id
        }
    } else {
        // New user - create with password
        sqlx::query_scalar::<_, uuid::Uuid>(
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
        )
        .bind(&uname)
        .bind(&password_hash)
        .fetch_one(&state.db)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?
    };

    // Mint short TTL token
    let token: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(40)
        .map(char::from)
        .collect();
    use time::{Duration, OffsetDateTime};
    let expires_at = OffsetDateTime::now_utc() + Duration::minutes(10);

    sqlx::query(
        "INSERT INTO provision_tokens (user_id,purpose,token_hash,expires_at) VALUES ($1,'install',digest($2,'sha256'),$3)",
    )
    .bind(uid)
    .bind(&token)
    .bind(expires_at)
    .execute(&state.db)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

    Ok(Json(Resp {
        provision_token: token,
    }))
}

