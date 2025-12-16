# Running the ZeroChat Server - Professional Guide

## File Structure (Professional Setup)

```
zerochat/
├── server/                    ← Server source code
│   ├── src/
│   ├── static/               ← ALL static files go here
│   │   ├── downloads/
│   │   │   ├── android/      ← Put APK files here
│   │   │   ├── macos/        ← Put DMG files here
│   │   │   ├── windows/      ← Put EXE files here
│   │   │   └── linux/
│   │   └── invite.html
│   └── Cargo.toml
├── zerochat-desktop/
├── zerochat-android/
└── run-server.sh             ← Simple server runner
```

## WHY This Structure Matters

The server uses **relative paths** to find files:
- `static/downloads/android/ZeroChat-latest.apk`
- `static/invite.html`

These paths are relative to the **working directory** when you start the server.

### ❌ WRONG WAY (causes 404 errors):
```bash
# Running from project root
cargo run --bin server
```
This looks for `static/` in the project root (doesn't exist!)

### ✅ RIGHT WAY:
```bash
# Running from server/ directory
cd server
cargo run
```
This looks for `static/` in the server directory (exists!)

## How to Run the Server

### Option 1: Use the Simple Script (Recommended for Development)
```bash
./run-server.sh
```

### Option 2: Use the Full Startup Script (Recommended for Production)
```bash
./START_APP.sh
```

### Option 3: Manual (if you know what you're doing)
```bash
cd server
export DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat"
export REDIS_URL="redis://localhost:6379"
cargo run
```

## Where to Put Download Files

### Android APK:
```bash
# After building the APK
cp zerochat-android/app/build/outputs/apk/debug/app-debug.apk \
   server/static/downloads/android/ZeroChat-latest.apk
```

### macOS DMG:
```bash
# After building the DMG
cp path/to/ZeroChat.dmg \
   server/static/downloads/macos/ZeroChat-latest.dmg
```

### Windows EXE:
```bash
# After building the EXE
cp path/to/ZeroChat.exe \
   server/static/downloads/windows/ZeroChat-latest.exe
```

## Professional Deployment

When deploying to production (Digital Ocean), make sure:

1. The server binary runs from the `server/` directory
2. The `server/static/` folder is deployed with the binary
3. Environment variables are set:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `BIND_ADDR` (optional, defaults to `0.0.0.0:8080`)

### Example systemd service file:
```ini
[Unit]
Description=ZeroChat Server
After=network.target

[Service]
Type=simple
User=zerochat
WorkingDirectory=/opt/zerochat/server
Environment=DATABASE_URL=postgresql://...
Environment=REDIS_URL=redis://...
Environment=RUST_LOG=info
ExecStart=/opt/zerochat/target/release/server
Restart=always

[Install]
WantedBy=multi-user.target
```

Note: `WorkingDirectory=/opt/zerochat/server` ensures paths work correctly!

## Troubleshooting

### Downloads show 404 error:
- **Cause**: Server not running from `server/` directory
- **Fix**: Always use `./run-server.sh` or `cd server && cargo run`

### Android download stuck at "7.3 MB / 7.3 MB":
- **Cause**: Missing `Content-Length` header (already fixed in code)
- **Fix**: Restart server to use updated code

### White screen on Android:
- **Cause**: `index.html` has `type="module"` in script tag
- **Fix**: Remove `type="module"` from `zerochat-android/app/src/main/assets/www/index.html`

## Summary

**Always remember**: Run the server from the `server/` directory, either directly or via scripts that `cd server` first!
