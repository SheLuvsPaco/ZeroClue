use axum::{
    body::Body,
    http::{header, HeaderMap, HeaderValue, StatusCode},
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

/// Get the static downloads directory using absolute path resolution.
/// Priority: 1) ZEROCLUE_DOWNLOADS_DIR env var, 2) relative to executable, 3) current dir fallback
fn get_downloads_dir() -> PathBuf {
    // Priority 1: Environment variable (deployment-friendly)
    if let Ok(dir) = std::env::var("ZEROCLUE_DOWNLOADS_DIR") {
        return PathBuf::from(dir);
    }
    
    // Priority 2: Relative to executable location
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            let downloads_path = exe_dir.join("static").join("downloads");
            if downloads_path.exists() {
                return downloads_path;
            }
        }
    }
    
    // Priority 3: Relative to current directory (development fallback)
    PathBuf::from("static/downloads")
}

async fn send_file(subpath: &str, filename: &str, mime: &str) -> Response {
    let downloads_dir = get_downloads_dir();
    let path_buf = downloads_dir.join(subpath);

    tracing::debug!("Attempting to serve file from: {}", path_buf.display());

    // Read entire file into memory to get proper Content-Length
    // This is CRITICAL for Android DownloadManager to know when download is complete
    let file_bytes = match fs::read(&path_buf).await {
        Ok(bytes) => bytes,
        Err(e) => {
            tracing::warn!(
                "Download file not found or unreadable at {}: {}. Downloads dir: {}",
                path_buf.display(),
                e,
                downloads_dir.display()
            );
            return (
                StatusCode::NOT_FOUND,
                format!("File not found: {}", filename),
            )
                .into_response();
        }
    };

    let content_length = file_bytes.len();
    tracing::info!(
        "Serving {} ({} bytes) from {}",
        filename,
        content_length,
        path_buf.display()
    );

    // Build headers - Content-Length is ESSENTIAL for download completion detection
    let mut headers = HeaderMap::new();
    
    if let Ok(v) = HeaderValue::from_str(mime) {
        headers.insert(header::CONTENT_TYPE, v);
    }
    
    if let Ok(v) = HeaderValue::from_str(&format!("attachment; filename=\"{}\"", filename)) {
        headers.insert(header::CONTENT_DISPOSITION, v);
    }
    
    if let Ok(v) = HeaderValue::from_str(&content_length.to_string()) {
        headers.insert(header::CONTENT_LENGTH, v);
    }
    
    headers.insert(header::ACCEPT_RANGES, HeaderValue::from_static("bytes"));
    headers.insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("no-store, no-cache, must-revalidate"),
    );

    (headers, Body::from(file_bytes)).into_response()
}

async fn download_dmg() -> impl IntoResponse {
    send_file(
        "macos/ZeroChat-latest.dmg",
        "ZeroChat-latest.dmg",
        "application/x-apple-diskimage",
    )
    .await
}

async fn download_apk() -> impl IntoResponse {
    send_file(
        "android/ZeroChat-latest.apk",
        "ZeroChat-latest.apk",
        "application/vnd.android.package-archive",
    )
    .await
}

async fn download_windows() -> impl IntoResponse {
    send_file(
        "windows/ZeroChat-latest.exe",
        "ZeroChat-latest.exe",
        "application/octet-stream",
    )
    .await
}


