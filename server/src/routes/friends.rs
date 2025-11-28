use axum::{
    extract::State,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::auth::DeviceAuth;
use crate::AppState;

#[derive(Deserialize)]
pub struct FriendRequestReq {
    pub username: String,
}

#[derive(Serialize)]
pub struct FriendRequestResp {
    pub friendship_id: Uuid,
    pub status: String,
}

#[derive(Deserialize)]
pub struct FriendRespondReq {
    pub from_username: String,
    pub accept: bool,
}

#[derive(Serialize)]
pub struct Friend {
    pub username: String,
    pub user_id: Uuid,
    pub status: String,
    pub created_at: String,
}

#[derive(Serialize)]
pub struct FriendsListResp {
    pub friends: Vec<Friend>,
}

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/api/friends/request", post(request_friend))
        .route("/api/friends/respond", post(respond_friend))
        .route("/api/friends/list", get(list_friends))
}

pub async fn request_friend(
    State(state): State<AppState>,
    auth: DeviceAuth,
    Json(body): Json<FriendRequestReq>,
) -> Result<(StatusCode, Json<FriendRequestResp>), (StatusCode, String)> {
    let addressee_username = body.username.to_lowercase().trim().to_string();
    if addressee_username.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "username required".into()));
    }

    // Get current user's username to compare
    let current_username: Option<String> = sqlx::query_scalar!(
        "SELECT username FROM users WHERE id = $1",
        auth.user_id
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if let Some(ref uname) = current_username {
        if addressee_username == *uname {
            return Err((StatusCode::BAD_REQUEST, "cannot friend yourself".into()));
        }
    }

    // Get addressee user_id
    let addressee_id: Option<Uuid> = sqlx::query_scalar!(
        "SELECT id FROM users WHERE username = $1",
        addressee_username
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let addressee_id = addressee_id
        .ok_or_else(|| (StatusCode::NOT_FOUND, "user not found".into()))?;

    // Check if friendship already exists
    let existing: Option<(Uuid, String)> = sqlx::query_as(
        r#"
        SELECT id, status FROM friendships
        WHERE (requester = $1 AND addressee = $2) OR (requester = $2 AND addressee = $1)
        "#,
    )
    .bind(auth.user_id)
    .bind(addressee_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if let Some((id, status)) = existing {
        return Ok((
            StatusCode::OK,
            Json(FriendRequestResp {
                friendship_id: id,
                status,
            }),
        ));
    }

    // Create new friendship request
    let friendship_id: Uuid = sqlx::query_scalar!(
        r#"
        INSERT INTO friendships (requester, addressee, status)
        VALUES ($1, $2, 'pending')
        RETURNING id
        "#,
        auth.user_id,
        addressee_id
    )
    .fetch_one(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((
        StatusCode::CREATED,
        Json(FriendRequestResp {
            friendship_id,
            status: "pending".to_string(),
        }),
    ))
}

pub async fn respond_friend(
    State(state): State<AppState>,
    auth: DeviceAuth,
    Json(body): Json<FriendRespondReq>,
) -> Result<(StatusCode, Json<FriendRequestResp>), (StatusCode, String)> {
    let from_username = body.from_username.to_lowercase().trim().to_string();
    if from_username.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "username required".into()));
    }

    // Get requester user_id
    let requester_id: Option<Uuid> = sqlx::query_scalar!(
        "SELECT id FROM users WHERE username = $1",
        from_username
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let requester_id = requester_id
        .ok_or_else(|| (StatusCode::NOT_FOUND, "user not found".into()))?;

    // Update friendship status
    let new_status = if body.accept { "accepted" } else { "rejected" };
    let updated: Option<Uuid> = sqlx::query_scalar!(
        r#"
        UPDATE friendships
        SET status = $3
        WHERE requester = $1 AND addressee = $2 AND status = 'pending'
        RETURNING id
        "#,
        requester_id,
        auth.user_id,
        new_status
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let friendship_id = updated
        .ok_or_else(|| (StatusCode::NOT_FOUND, "no pending request found".into()))?;

    Ok((
        StatusCode::OK,
        Json(FriendRequestResp {
            friendship_id,
            status: new_status.to_string(),
        }),
    ))
}

pub async fn list_friends(
    State(state): State<AppState>,
    auth: DeviceAuth,
) -> Result<Json<FriendsListResp>, (StatusCode, String)> {
    #[derive(sqlx::FromRow)]
    struct Row {
        username: String,
        user_id: Uuid,
        status: String,
        created_at: time::OffsetDateTime,
    }

    let rows: Vec<Row> = sqlx::query_as(
        r#"
        SELECT 
            CASE 
                WHEN f.requester = $1 THEN u2.username
                ELSE u1.username
            END as username,
            CASE 
                WHEN f.requester = $1 THEN f.addressee
                ELSE f.requester
            END as user_id,
            f.status,
            f.created_at
        FROM friendships f
        JOIN users u1 ON f.requester = u1.id
        JOIN users u2 ON f.addressee = u2.id
        WHERE f.requester = $1 OR f.addressee = $1
        ORDER BY f.created_at DESC
        "#,
    )
    .bind(auth.user_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let friends: Vec<Friend> = rows
        .into_iter()
        .map(|r| Friend {
            username: r.username,
            user_id: r.user_id,
            status: r.status,
            created_at: r.created_at.to_string(),
        })
        .collect();

    Ok(Json(FriendsListResp { friends }))
}

