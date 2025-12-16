use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};

use crate::AppState;

#[derive(Deserialize)]
pub struct SignupReq {
    pub username: String,
    pub password: String,
    pub invite_token: Option<String>, // Optional invite token for auto-friending
}

#[derive(Deserialize)]
pub struct LoginReq {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct AuthResp {
    pub provision_token: String,
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/signup", post(signup))
        .route("/api/login", post(login))
}

// Signup: Create new account only
pub async fn signup(
    State(state): State<AppState>,
    Json(req): Json<SignupReq>,
) -> Result<(StatusCode, Json<AuthResp>), (StatusCode, String)> {
    use rand::{distributions::Alphanumeric, Rng};
    use regex::Regex;
    use time::{Duration, OffsetDateTime};

    let uname = req.username.to_lowercase();
    let re = Regex::new("^[a-z0-9_]{3,24}$").unwrap();
    if !re.is_match(&uname) {
        return Err((
            StatusCode::BAD_REQUEST,
            "Username must be 3-24 characters, lowercase letters, numbers, and underscores only".to_string(),
        ));
    }

    // Validate password length
    if req.password.len() < 8 {
        return Err((
            StatusCode::BAD_REQUEST,
            "Password must be at least 8 characters".to_string(),
        ));
    }

    // Hash password with Argon2id
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash_str = argon2
        .hash_password(req.password.as_bytes(), &salt)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("password hash error: {e}")))?
        .to_string();

    // Store as UTF-8 bytes (Argon2 hash is a PHC-formatted string)
    let password_hash = password_hash_str.as_bytes().to_vec();

    tracing::debug!("Signup: Argon2 password hash length: {}", password_hash.len());

    // Check if user already exists with this username
    let existing: Option<Uuid> = sqlx::query_scalar::<_, Uuid>(
        "SELECT id FROM users WHERE username = $1",
    )
    .bind(&uname)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

    if existing.is_some() {
        return Err((
            StatusCode::CONFLICT,
            "Username already exists. Use login instead.".to_string(),
        ));
    }

    // Start transaction for invite token handling
    let mut tx = state.db.begin().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

    // If invite_token provided, validate it and get inviter info
    let inviter_username: Option<String> = if let Some(ref invite_token) = req.invite_token {
        tracing::info!("Signup with invite token");

        // Hash the invite token
        let mut token_hasher = Sha256::new();
        token_hasher.update(invite_token.as_bytes());
        let token_hash = token_hasher.finalize().to_vec();

        // Find the invite token and get inviter_username
        let token_row: Option<(Uuid, Option<String>)> = sqlx::query_as(
            r#"SELECT id, inviter_username FROM provision_tokens
               WHERE token_hash = $1
               AND purpose = 'invite'
               AND used_at IS NULL
               AND expires_at > now()"#
        )
        .bind(&token_hash)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

        if let Some((_token_id, inviter)) = token_row {
            tracing::info!("Valid invite token - inviter: {:?}", inviter);
            inviter
        } else {
            tracing::warn!("Invalid or expired invite token");
            return Err((
                StatusCode::BAD_REQUEST,
                "Invalid or expired invite token".to_string(),
            ));
        }
    } else {
        None
    };

    // Create new user
    let user_id: Uuid = sqlx::query_scalar::<_, Uuid>(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
    )
    .bind(&uname)
    .bind(&password_hash)
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| {
        // If it's a unique constraint violation, the username already exists
        if e.to_string().contains("unique") || e.to_string().contains("duplicate") {
            return (StatusCode::CONFLICT, "Username already exists. Use login instead.".to_string());
        }
        (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}"))
    })?;

    // If this is an invite signup, update the invite token with the new user_id
    if let Some(ref invite_token) = req.invite_token {
        let mut token_hasher = Sha256::new();
        token_hasher.update(invite_token.as_bytes());
        let token_hash = token_hasher.finalize().to_vec();

        sqlx::query!(
            "UPDATE provision_tokens SET user_id = $1 WHERE token_hash = $2 AND purpose = 'invite'",
            user_id,
            token_hash
        )
        .execute(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

        tracing::info!("Invite token updated with user_id: {}", user_id);

        // Return the invite token as the provision token (it's already valid)
        tx.commit().await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

        return Ok((
            StatusCode::CREATED,
            Json(AuthResp {
                provision_token: invite_token.clone(),
            }),
        ));
    }

    // Generate new provision token for regular signup (no invite)
    let token: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(40)
        .map(char::from)
        .collect();

    let expires_at = OffsetDateTime::now_utc() + Duration::minutes(10);

    sqlx::query(
        "INSERT INTO provision_tokens (user_id, purpose, token_hash, expires_at) VALUES ($1, 'install', digest($2, 'sha256'), $3)",
    )
    .bind(user_id)
    .bind(&token)
    .bind(expires_at)
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

    tx.commit().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}")))?;

    Ok((
        StatusCode::CREATED,
        Json(AuthResp {
            provision_token: token,
        }),
    ))
}

// Login: Authenticate existing account
pub async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginReq>,
) -> Result<Json<AuthResp>, (StatusCode, String)> {
    use rand::{distributions::Alphanumeric, Rng};
    use time::{Duration, OffsetDateTime};

    let uname = req.username.to_lowercase();
    tracing::info!("Login request for user: {}", uname);

    // Find user and verify password
    #[derive(sqlx::FromRow)]
    struct UserRow {
        id: Uuid,
        password_hash: Option<Vec<u8>>,
    }

    let user: Option<UserRow> = sqlx::query_as(
        "SELECT id, password_hash FROM users WHERE username = $1",
    )
    .bind(&uname)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| {
        tracing::error!("Database error during login: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}"))
    })?;

    let user = user.ok_or_else(|| {
        tracing::warn!("Login failed - user not found: {}", uname);
        (
            StatusCode::UNAUTHORIZED,
            "Invalid username or password".to_string(),
        )
    })?;

    // Verify password with Argon2
    match &user.password_hash {
        Some(ref hash_bytes) => {
            // Convert stored hash bytes to string
            let hash_str = std::str::from_utf8(hash_bytes)
                .map_err(|_| {
                    tracing::error!("Invalid UTF-8 in stored password hash");
                    (StatusCode::INTERNAL_SERVER_ERROR, "Invalid password hash format".to_string())
                })?;

            // Parse the PHC-formatted hash string
            let parsed_hash = PasswordHash::new(hash_str)
                .map_err(|e| {
                    tracing::error!("Failed to parse password hash: {}", e);
                    (StatusCode::INTERNAL_SERVER_ERROR, "Invalid password hash format".to_string())
                })?;

            // Verify password
            let argon2 = Argon2::default();
            match argon2.verify_password(req.password.as_bytes(), &parsed_hash) {
                Ok(_) => {
                    tracing::info!("Login successful for user: {}", uname);
                }
                Err(_) => {
                    tracing::warn!("Login failed - password mismatch for user: {}", uname);
                    return Err((
                        StatusCode::UNAUTHORIZED,
                        "Invalid username or password".to_string(),
                    ));
                }
            }
        }
        None => {
            // User exists but has no password - this shouldn't happen with new system
            tracing::error!("User {} has no password hash set", uname);
            return Err((
                StatusCode::UNAUTHORIZED,
                "Account has no password set. Please sign up again.".to_string(),
            ));
        }
    }

    // Generate provision token
    let token: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(40)
        .map(char::from)
        .collect();

    let expires_at = OffsetDateTime::now_utc() + Duration::minutes(10);

    sqlx::query(
        "INSERT INTO provision_tokens (user_id, purpose, token_hash, expires_at) VALUES ($1, 'install', digest($2, 'sha256'), $3)",
    )
    .bind(user.id)
    .bind(&token)
    .bind(expires_at)
    .execute(&state.db)
    .await
    .map_err(|e| {
        tracing::error!("Failed to insert provision token: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}"))
    })?;
    
    Ok(Json(AuthResp {
        provision_token: token,
    }))
}

