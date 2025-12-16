use axum::{
    body::Body,
    http::{header, HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    Router,
};
use std::path::PathBuf;
use tokio::fs::File;
use tokio_util::io::ReaderStream;

use crate::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/download/macos/latest", get(download_dmg))
        .route("/download/android/latest", get(download_apk))
        .route("/download/windows/latest", get(download_windows))
}

async fn send_file(path: &str, filename: &str, mime: &str) -> Response {
    let path_buf = PathBuf::from(path);

    // Try to open file; 404 if missing
    let file = match File::open(&path_buf).await {
        Ok(f) => f,
        Err(e) => {
            tracing::warn!(
                "Download file not found or unreadable at {}: {}",
                path_buf.display(),
                e
            );
            return StatusCode::NOT_FOUND.into_response();
        }
    };

    let stream = ReaderStream::new(file);

    let mut headers = HeaderMap::new();
    headers.insert(header::CONTENT_TYPE, mime.parse().unwrap());
    headers.insert(
        header::CONTENT_DISPOSITION,
        format!("attachment; filename=\"{}\"", filename)
            .parse()
            .unwrap(),
    );
    headers.insert(
        header::CACHE_CONTROL,
        "no-store, no-cache, must-revalidate".parse().unwrap(),
    );

    (headers, Body::from_stream(stream)).into_response()
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


