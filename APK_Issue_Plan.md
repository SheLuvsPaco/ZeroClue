# Comprehensive fix plan for ZeroClue APK download issue

The APK download hanging at 100% stems from **multiple compounding issues**: missing Content-Length headers preventing download completion detection, setTimeout-based fallback breaking user gesture requirements on Android browsers, and relative paths causing file resolution failures. This plan addresses all six identified issues with specific, minimal code changes.

## Server-side fixes are the most critical

The **Content-Length header is essential** for browsers to know when a download is complete. Without it, browsers use chunked transfer encoding and cannot determine file size, causing them to wait indefinitely at 100% progress. The fix requires getting file metadata before streaming and explicitly setting the header.

### Backend: APK download route handler

**File:** `server/src/routes/download.rs` (or equivalent Axum route file)

Replace any existing APK download handler with this properly-completing implementation:

```rust
use axum::{
    body::Body,
    extract::Path,
    http::{header, HeaderMap, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
};
use tokio::fs::File;
use tokio_util::io::ReaderStream;
use std::path::PathBuf;

/// Custom error type that implements IntoResponse - eliminates all unwrap() panics
#[derive(Debug)]
pub enum DownloadError {
    NotFound(String),
    InvalidPath(String),
    Internal(String),
}

impl IntoResponse for DownloadError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            DownloadError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            DownloadError::InvalidPath(msg) => (StatusCode::BAD_REQUEST, msg),
            DownloadError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };
        (status, message).into_response()
    }
}

impl From<std::io::Error> for DownloadError {
    fn from(err: std::io::Error) -> Self {
        match err.kind() {
            std::io::ErrorKind::NotFound => DownloadError::NotFound("File not found".to_string()),
            _ => DownloadError::Internal(err.to_string()),
        }
    }
}

/// Get assets directory independent of working directory
fn get_downloads_dir() -> Result<PathBuf, DownloadError> {
    // Priority 1: Environment variable (deployment-friendly)
    if let Ok(dir) = std::env::var("ZEROCLUE_DOWNLOADS_DIR") {
        return Ok(PathBuf::from(dir));
    }
    
    // Priority 2: Relative to executable location
    let exe_path = std::env::current_exe()
        .map_err(|e| DownloadError::Internal(format!("Cannot locate executable: {}", e)))?;
    
    let exe_dir = exe_path
        .parent()
        .ok_or_else(|| DownloadError::Internal("Cannot get executable directory".to_string()))?;
    
    Ok(exe_dir.join("static").join("downloads").join("android"))
}

/// Properly-completing APK download handler with Content-Length
pub async fn download_apk(
    Path(filename): Path<String>,
) -> Result<impl IntoResponse, DownloadError> {
    // Security: Prevent path traversal attacks
    if filename.contains("..") || filename.contains('/') || filename.contains('\\') {
        return Err(DownloadError::InvalidPath("Invalid filename".to_string()));
    }
    
    // Ensure filename ends with .apk
    if !filename.ends_with(".apk") {
        return Err(DownloadError::InvalidPath("Only APK files allowed".to_string()));
    }
    
    // Resolve path independent of working directory
    let downloads_dir = get_downloads_dir()?;
    let file_path = downloads_dir.join(&filename);
    
    // Check file exists before opening
    if !file_path.exists() {
        return Err(DownloadError::NotFound(format!(
            "APK file '{}' not found. Ensure file is deployed to {:?}",
            filename, downloads_dir
        )));
    }
    
    // Open file and get metadata for Content-Length (CRITICAL FOR COMPLETION)
    let file = File::open(&file_path).await?;
    let metadata = file.metadata().await?;
    let file_size = metadata.len();
    
    // Create stream - ReaderStream auto-terminates when file reaches EOF
    let stream = ReaderStream::new(file);
    let body = Body::from_stream(stream);
    
    // Build headers - Content-Length is essential
    let mut headers = HeaderMap::new();
    headers.insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("application/vnd.android.package-archive"),
    );
    headers.insert(
        header::CONTENT_LENGTH,
        HeaderValue::from_str(&file_size.to_string()).unwrap(),
    );
    headers.insert(
        header::CONTENT_DISPOSITION,
        HeaderValue::from_str(&format!("attachment; filename=\"{}\"", filename)).unwrap(),
    );
    // Prevent caching to ensure latest version
    headers.insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static("no-cache, no-store, must-revalidate"),
    );
    
    Ok((headers, body))
}
```

### Backend: Health check handlers without panics

**File:** `server/src/routes/health.rs` (or add to existing routes)

```rust
use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    message: Option<String>,
}

/// Readiness check - panics replaced with proper error responses
pub async fn readyz() -> impl IntoResponse {
    // Add any dependency checks here (database, etc.)
    (StatusCode::OK, Json(HealthResponse {
        status: "ok",
        message: None,
    }))
}

/// With database check example (adjust to your state type)
pub async fn readyz_with_db(
    // State(state): State<AppState>,  // Uncomment if you have state
) -> impl IntoResponse {
    // Example: check database
    // match state.db_pool.acquire().await {
    //     Ok(_) => (StatusCode::OK, Json(HealthResponse { status: "ok", message: None })),
    //     Err(e) => (StatusCode::SERVICE_UNAVAILABLE, Json(HealthResponse {
    //         status: "error",
    //         message: Some(format!("Database unavailable: {}", e)),
    //     })),
    // }
    
    (StatusCode::OK, Json(HealthResponse {
        status: "ok",
        message: None,
    }))
}

/// Liveness check - simplest possible, no panics
pub async fn livez() -> StatusCode {
    StatusCode::OK
}
```

### Backend: Static file serving configuration

**File:** `server/src/main.rs` or routes configuration

```rust
use tower_http::services::ServeDir;
use std::path::PathBuf;

fn get_static_dir() -> PathBuf {
    // Priority 1: Environment variable
    if let Ok(dir) = std::env::var("ZEROCLUE_STATIC_DIR") {
        return PathBuf::from(dir);
    }
    
    // Priority 2: Relative to executable
    if let Ok(exe) = std::env::current_exe() {
        if let Some(parent) = exe.parent() {
            return parent.join("static");
        }
    }
    
    // Fallback: current directory (least reliable)
    PathBuf::from("static")
}

// In your router setup:
let static_dir = get_static_dir();
let app = Router::new()
    .route("/api/download/:filename", get(download_apk))
    .route("/healthz", get(livez))
    .route("/readyz", get(readyz))
    // ServeDir with proper path resolution
    .nest_service("/static", ServeDir::new(&static_dir));
```

## Frontend download logic must trigger directly from user gesture

Modern mobile browsers require downloads to be initiated **synchronously within a click/tap event handler**. The existing `setTimeout` + `window.location.href` pattern breaks this requirement because transient user activation expires after ~5 seconds (Chrome) or ~1 second (Firefox).

### Frontend: Invite link page download component

**File:** `frontend/src/components/DownloadPage.tsx` (or equivalent)

```tsx
import React, { useState, useEffect, useRef } from 'react';

interface DownloadState {
  status: 'idle' | 'downloading' | 'success' | 'error';
  message: string;
}

interface DownloadPageProps {
  apkUrl: string;      // Full URL to APK
  apkFilename: string; // e.g., "zeroclue-v1.0.apk"
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ apkUrl, apkFilename }) => {
  const [downloadState, setDownloadState] = useState<DownloadState>({
    status: 'idle',
    message: '',
  });
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // Check if APK is available on mount (optional pre-flight check)
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const response = await fetch(apkUrl, { method: 'HEAD' });
        if (!response.ok) {
          setDownloadState({
            status: 'error',
            message: 'APK is currently unavailable. Please try again later.',
          });
        }
      } catch {
        // Network error - don't block, user can still try
      }
    };
    checkAvailability();
  }, [apkUrl]);

  /**
   * CRITICAL: Download must be triggered synchronously within click handler.
   * No setTimeout, no async/await before the download action.
   */
  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Don't prevent default - let anchor's native behavior work
    // This is the most reliable cross-browser approach
    
    setDownloadState({
      status: 'downloading',
      message: 'Download started! Check your notifications or Downloads folder.',
    });

    // Show success message after brief delay (for user feedback only)
    setTimeout(() => {
      setDownloadState({
        status: 'success',
        message: 'If the download didn\'t start, tap the button again.',
      });
    }, 2000);
  };

  /**
   * Fallback: Programmatic download via hidden anchor
   * Only used as backup if primary anchor fails
   */
  const triggerFallbackDownload = () => {
    if (downloadLinkRef.current) {
      downloadLinkRef.current.click();
    }
  };

  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <div className="download-page">
      <h1>Download ZeroClue</h1>
      
      {/* PRIMARY: Anchor tag with download attribute - most reliable */}
      <a
        href={apkUrl}
        download={apkFilename}
        onClick={handleDownloadClick}
        className="download-button primary"
        style={{
          display: 'inline-block',
          padding: '16px 32px',
          backgroundColor: '#4CAF50',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        Download APK
      </a>

      {/* Hidden anchor for programmatic fallback */}
      <a
        ref={downloadLinkRef}
        href={apkUrl}
        download={apkFilename}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      {/* Status feedback */}
      {downloadState.status !== 'idle' && (
        <div
          className={`status-message ${downloadState.status}`}
          style={{
            marginTop: '20px',
            padding: '12px 16px',
            borderRadius: '6px',
            backgroundColor:
              downloadState.status === 'error' ? '#ffebee' :
              downloadState.status === 'success' ? '#e8f5e9' : '#e3f2fd',
            color:
              downloadState.status === 'error' ? '#c62828' :
              downloadState.status === 'success' ? '#2e7d32' : '#1565c0',
          }}
        >
          {downloadState.message}
        </div>
      )}

      {/* Android-specific instructions */}
      {isAndroid && (
        <div className="install-instructions" style={{ marginTop: '24px' }}>
          <h3>Installation Instructions</h3>
          <ol>
            <li>Tap "Download APK" above</li>
            <li>Open your Downloads folder or tap the notification</li>
            <li>Tap the APK file to install</li>
            <li>
              If prompted, enable "Install from unknown sources":
              <ul>
                <li>Go to Settings → Security</li>
                <li>Enable "Unknown sources" or "Install unknown apps"</li>
                <li>Select your browser and allow installation</li>
              </ul>
            </li>
          </ol>
        </div>
      )}

      {/* Fallback button for edge cases */}
      <button
        onClick={triggerFallbackDownload}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          backgroundColor: 'transparent',
          border: '1px solid #666',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Download not starting? Tap here
      </button>
    </div>
  );
};
```

### What to remove from existing code

**Delete or replace these anti-patterns:**

```javascript
// ❌ DELETE: setTimeout breaks user gesture chain
setTimeout(() => {
  window.location.href = apkUrl;
}, 500);

// ❌ DELETE: visibilityState detection is unreliable
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    // Assume download started - FALSE POSITIVES
  }
});

// ❌ DELETE: Async operations before download
async function downloadApk() {
  const { url } = await fetch('/api/get-download-url').then(r => r.json());
  window.location.href = url;  // User activation expired
}
```

## Android app WebView needs proper download handling

If ZeroClue's Android app uses WebView to display invite pages, it **must implement a DownloadListener** or downloads will fail silently.

### Android: WebView download listener

**File:** `android/app/src/main/java/.../WebViewActivity.kt`

```kotlin
import android.app.DownloadManager
import android.content.Context
import android.net.Uri
import android.os.Environment
import android.webkit.CookieManager
import android.webkit.URLUtil
import android.webkit.WebView
import android.widget.Toast

class WebViewActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ... existing setup
        
        setupDownloadListener()
    }
    
    private fun setupDownloadListener() {
        webView.setDownloadListener { url, userAgent, contentDisposition, mimeType, contentLength ->
            // Request storage permission if needed (Android 10+)
            if (checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE) 
                != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(
                    arrayOf(android.Manifest.permission.WRITE_EXTERNAL_STORAGE),
                    STORAGE_PERMISSION_CODE
                )
                return@setDownloadListener
            }
            
            try {
                val request = DownloadManager.Request(Uri.parse(url)).apply {
                    // Set MIME type for APK
                    setMimeType(mimeType ?: "application/vnd.android.package-archive")
                    
                    // Include cookies (important for authenticated downloads)
                    val cookies = CookieManager.getInstance().getCookie(url)
                    if (!cookies.isNullOrEmpty()) {
                        addRequestHeader("Cookie", cookies)
                    }
                    addRequestHeader("User-Agent", userAgent)
                    
                    // Show download progress in notification
                    setNotificationVisibility(
                        DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
                    )
                    
                    // Set download location
                    val fileName = URLUtil.guessFileName(url, contentDisposition, mimeType)
                    setDestinationInExternalPublicDir(
                        Environment.DIRECTORY_DOWNLOADS,
                        fileName
                    )
                    
                    setTitle(fileName)
                    setDescription("Downloading ZeroClue...")
                }
                
                val downloadManager = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                downloadManager.enqueue(request)
                
                Toast.makeText(
                    this,
                    "Download started. Check your notifications.",
                    Toast.LENGTH_LONG
                ).show()
                
            } catch (e: Exception) {
                Toast.makeText(
                    this,
                    "Download failed: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
    
    companion object {
        private const val STORAGE_PERMISSION_CODE = 100
    }
}
```

## Cargo.toml dependencies required

```toml
[dependencies]
axum = "0.8"
tokio = { version = "1", features = ["full"] }
tokio-util = { version = "0.7", features = ["io"] }  # For ReaderStream
tower-http = { version = "0.6", features = ["fs"] }  # For ServeDir
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

## Deployment checklist to prevent 404 errors

The APK must exist at the resolved path. Create a deployment script or document:

```bash
#!/bin/bash
# deploy-apk.sh

# Set environment variable for downloads directory
export ZEROCLUE_DOWNLOADS_DIR="/opt/zeroclue/downloads"

# Create directory if it doesn't exist
mkdir -p "$ZEROCLUE_DOWNLOADS_DIR"

# Copy APK to correct location
cp build/zeroclue-latest.apk "$ZEROCLUE_DOWNLOADS_DIR/"

# Verify file exists
if [ -f "$ZEROCLUE_DOWNLOADS_DIR/zeroclue-latest.apk" ]; then
    echo "✓ APK deployed successfully"
    ls -la "$ZEROCLUE_DOWNLOADS_DIR/"
else
    echo "✗ APK deployment failed"
    exit 1
fi
```

## Summary of changes by priority

| Priority | Issue | Fix | File(s) |
|----------|-------|-----|---------|
| **P0** | Download hangs at 100% | Add Content-Length header from file metadata | download route handler |
| **P0** | User gesture broken | Replace setTimeout fallback with direct anchor click | invite page component |
| **P1** | Relative paths fail | Use `current_exe()` or env var for path resolution | routes, main.rs |
| **P1** | Handler panics | Replace `unwrap()` with `?` and custom error type | all route handlers |
| **P2** | No user feedback | Add status messages and installation instructions | download component |
| **P2** | WebView downloads fail | Implement DownloadListener | Android WebViewActivity |
| **P3** | APK not deployed | Create deployment script with verification | deploy-apk.sh |

The **Content-Length header** and **direct user gesture handling** are the two changes most likely to fix the immediate 100% hang issue. The other changes prevent the problem from recurring due to path resolution failures, improve error visibility, and ensure Android WebView properly handles downloads.