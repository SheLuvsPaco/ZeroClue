use axum::{
    body::Body,
    http::{header, HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use std::path::PathBuf;
use tokio::fs;

use crate::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/download/macos/latest", get(download_dmg))
        .route("/download/android/latest", get(download_apk))
        .route("/download/windows/latest", get(download_windows))
}

async fn send_file(path: &str, filename: &str, mime: &str) -> Response {
    let path_buf = PathBuf::from(path);

    // Read entire file into memory to get proper Content-Length
    // This fixes Android DownloadManager hanging at 100%
    let file_bytes = match fs::read(&path_buf).await {
        Ok(bytes) => bytes,
        Err(e) => {
            tracing::warn!(
                "Download file not found or unreadable at {}: {}",
                path_buf.display(),
                e
            );
            return StatusCode::NOT_FOUND.into_response();
        }
    };

    let content_length = file_bytes.len();

    let mut headers = HeaderMap::new();
    headers.insert(header::CONTENT_TYPE, mime.parse().unwrap());
    headers.insert(
        header::CONTENT_DISPOSITION,
        format!("attachment; filename=\"{}\"", filename)
            .parse()
            .unwrap(),
    );
    headers.insert(header::CONTENT_LENGTH, content_length.to_string().parse().unwrap());
    headers.insert(
        header::ACCEPT_RANGES,
        "bytes".parse().unwrap(),
    );
    headers.insert(
        header::CACHE_CONTROL,
        "no-store, no-cache, must-revalidate".parse().unwrap(),
    );

    (headers, Body::from(file_bytes)).into_response()
}

async fn download_dmg() -> impl IntoResponse {
    send_file(
        "static/downloads/macos/ZeroChat-latest.dmg",
        "ZeroChat-latest.dmg",
        "application/x-apple-diskimage",
    )
    .await
}

async fn download_apk() -> impl IntoResponse {
    send_file(
        "static/downloads/android/ZeroChat-latest.apk",
        "ZeroChat-latest.apk",
        "application/vnd.android.package-archive",
    )
    .await
}

async fn download_windows() -> impl IntoResponse {
    send_file(
        "static/downloads/windows/ZeroChat-latest.exe",
        "ZeroChat-latest.exe",
        "application/octet-stream",
    )
    .await
}


