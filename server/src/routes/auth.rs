use axum::{extract::State, http::StatusCode, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use uuid::Uuid;

use crate::AppState;

#[derive(Deserialize)]
pub struct SignupReq {
    pub username: String,
    pub password: String,
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

    // Hash password with SHA256
    let mut hasher = Sha256::new();
    hasher.update(req.password.as_bytes());
    let password_hash = hasher.finalize().to_vec();
    
    tracing::debug!("Signup: Password hash length: {}", password_hash.len());

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

    // Create new user
    let user_id: Uuid = sqlx::query_scalar::<_, Uuid>(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id",
    )
    .bind(&uname)
    .bind(&password_hash)
    .fetch_one(&state.db)
    .await
    .map_err(|e| {
        // If it's a unique constraint violation, the username already exists
        if e.to_string().contains("unique") || e.to_string().contains("duplicate") {
            return (StatusCode::CONFLICT, "Username already exists. Use login instead.".to_string());
        }
        (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}"))
    })?;

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
    .bind(user_id)
    .bind(&token)
    .bind(expires_at)
    .execute(&state.db)
    .await
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
    
    tracing::info!("🔐 [LOGIN] ========== LOGIN REQUEST RECEIVED ==========");
    tracing::info!("🔐 [LOGIN] Username: {}", uname);
    tracing::info!("🔐 [LOGIN] Password length: {} bytes", req.password.len());

    // Hash password for comparison with SHA256
    let mut hasher = Sha256::new();
    hasher.update(req.password.as_bytes());
    let password_hash = hasher.finalize().to_vec();
    
    tracing::info!("🔐 [LOGIN] Password hash computed: {} bytes", password_hash.len());

    // Find user and verify password
    #[derive(sqlx::FromRow)]
    struct UserRow {
        id: Uuid,
        password_hash: Option<Vec<u8>>,
    }

    tracing::info!("🔐 [LOGIN] Querying database for user: {}", uname);
    let user: Option<UserRow> = sqlx::query_as(
        "SELECT id, password_hash FROM users WHERE username = $1",
    )
    .bind(&uname)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| {
        tracing::error!("🔐 [LOGIN] ❌ Database error: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}"))
    })?;

    let user = user.ok_or_else(|| {
        tracing::warn!("🔐 [LOGIN] ❌ User not found: {}", uname);
        (
            StatusCode::UNAUTHORIZED,
            "Invalid username or password".to_string(),
        )
    })?;
    
    tracing::info!("🔐 [LOGIN] ✅ User found: {} (id: {})", uname, user.id);

    // Check password
    tracing::info!("🔐 [LOGIN] Verifying password...");
    match &user.password_hash {
        Some(ref hash) => {
            tracing::info!("🔐 [LOGIN] Stored hash length: {} bytes", hash.len());
            // Compare byte arrays
            if hash.as_slice() == password_hash.as_slice() {
                tracing::info!("🔐 [LOGIN] ✅ Password matches!");
            } else {
                // Password doesn't match - log for debugging
                tracing::warn!("🔐 [LOGIN] ❌ Password mismatch for user: {}", uname);
                tracing::debug!("🔐 [LOGIN] Hash comparison failed - stored: {:?}, provided: {:?}", 
                    &hash[..8.min(hash.len())], &password_hash[..8.min(password_hash.len())]);
                return Err((
                    StatusCode::UNAUTHORIZED,
                    "Invalid username or password".to_string(),
                ));
            }
        }
        None => {
            // User exists but has no password - this shouldn't happen with new system
            tracing::error!("🔐 [LOGIN] ❌ User {} has no password hash set", uname);
            return Err((
                StatusCode::UNAUTHORIZED,
                "Account has no password set. Please sign up again.".to_string(),
            ));
        }
    }

    // Generate provision token
    tracing::info!("🔐 [LOGIN] Generating provision token...");
    let token: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(40)
        .map(char::from)
        .collect();

    let expires_at = OffsetDateTime::now_utc() + Duration::minutes(10);
    tracing::info!("🔐 [LOGIN] Token expires at: {}", expires_at);

    sqlx::query(
        "INSERT INTO provision_tokens (user_id, purpose, token_hash, expires_at) VALUES ($1, 'install', digest($2, 'sha256'), $3)",
    )
    .bind(user.id)
    .bind(&token)
    .bind(expires_at)
    .execute(&state.db)
    .await
    .map_err(|e| {
        tracing::error!("🔐 [LOGIN] ❌ Failed to insert provision token: {}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, format!("db error: {e}"))
    })?;

    tracing::info!("🔐 [LOGIN] ✅ Provision token created successfully");
    tracing::info!("🔐 [LOGIN] ========== LOGIN REQUEST COMPLETED ==========");
    
    Ok(Json(AuthResp {
        provision_token: token,
    }))
}

