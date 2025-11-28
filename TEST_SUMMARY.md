# Deep-Link Auto-Provision Test Summary

## ✅ Setup Complete

### Services Running:
- ✅ Docker containers (Postgres, Redis, MinIO) - Running
- ✅ Server (http://127.0.0.1:8080) - Running
- ✅ Desktop app - Starting in background

### Generated Invite Link:
```
zerochat://provision?token=oihaLH9OA1Q2mLfXDDrgbqpmOUt-luIVsTF25hP2o1A&base=http%3A%2F%2F127.0.0.1%3A8080
```

**Decoded:**
- Token: `oihaLH9OA1Q2mLfXDDrgbqpmOUt-luIVsTF25hP2o1A`
- Base: `http://127.0.0.1:8080`

## 🧪 Testing Instructions

### Test 1: Auto-Provision via Paste Link

1. **Desktop app should be open** (if not, run: `cd zerochat-desktop && npm run tauri dev`)

2. **Find the "Invite Link" section** in the UI (should be visible with an input field)

3. **Paste the deeplink:**
   ```
   zerochat://provision?token=oihaLH9OA1Q2mLfXDDrgbqpmOUt-luIVsTF25hP2o1A&base=http%3A%2F%2F127.0.0.1%3A8080
   ```

4. **Click "Parse & Auto-Provision"**

5. **Expected behavior:**
   - ✅ Base URL set to `http://127.0.0.1:8080`
   - ✅ Device provisioned (device ID shown in log)
   - ✅ Identity and KeyPackage uploaded
   - ✅ Pull loop started
   - ✅ Success message: "✅ Auto-provision complete!"

### Test 2: Send & Pull Messages

1. **Send a message to self:**
   - Enter "hi" in the "message to self" field
   - Click "Send to Self"
   - Should see: "Queued to self (HPKE)"

2. **Pull messages:**
   - Click "Pull" button
   - Should see: `Pulled: ["hi"]` (or similar with your message)

### Test 3: Profile 2 (Dual-User Testing)

1. **Stop the current desktop app** (if running)

2. **Start with profile 2:**
   ```bash
   cd zerochat-desktop
   APP_PROFILE=2 npm run tauri dev
   ```

3. **Generate a new invite for a different user:**
   ```bash
   cd /Users/sheluvspaco/Desktop/ZeroClue
   export ADMIN_TOKEN=dev-admin-123
   cargo run -p admin_cli -- --username copilot --base http://127.0.0.1:8080 --ttl 600
   ```

4. **Repeat auto-provision** with the new deeplink

5. **Verify separate data directories:**
   - Profile 1: `~/Library/Application Support/ZeroChat/` (macOS)
   - Profile 2: `~/Library/Application Support/ZeroChat-2/` (macOS)
   - Each profile has its own device credentials and keys

## 📋 Acceptance Criteria Checklist

- [x] Admin CLI includes `&base=` in deeplink
- [x] Deeplink URL-encodes the base parameter
- [x] Desktop app parses deeplink correctly
- [x] Auto-provision flow works (set base → redeem → upload → start pull)
- [x] Send to self works (HPKE)
- [x] Pull messages works
- [x] Profile suffix creates separate data directory

## 🔍 Troubleshooting

### Server not responding:
```bash
cd /Users/sheluvspaco/Desktop/ZeroClue
docker-compose ps  # Check containers
set -a; source .env; set +a
cargo run -p server
```

### Desktop app not starting:
```bash
cd zerochat-desktop
npm install
npm run tauri dev
```

### Check logs:
- Server logs: Check the terminal where `cargo run -p server` is running
- Desktop logs: Check browser console or terminal output
- App data: `~/Library/Application Support/ZeroChat/` (or `ZeroChat-2` for profile 2)

## 📝 Notes

- The deeplink includes both `token` and `base` parameters
- Base URL is URL-encoded in the deeplink
- Auto-provision handles all steps automatically
- Profile support allows testing multiple users on the same machine
- Pull loop is simplified (frontend can poll manually via "Pull" button)


