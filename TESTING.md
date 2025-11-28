# ZeroChat Testing Guide

## Quick Test Commands

### 1. Start Server

```bash
cd ~/Desktop/ZeroClue
set -a; source .env; set +a
cargo run -p server
```

Server should start on `http://127.0.0.1:8080`

### 2. Run Smoke Test

```bash
# In another terminal
cd ~/Desktop/ZeroClue
./scripts/local_smoke.sh
```

This tests:
- Signup (alice & bob)
- Provision token redemption
- Identity & KeyPackage upload
- Friend request/accept
- Message sending by username
- Message pull & ack

### 3. Start Desktop App

```bash
cd ~/Desktop/ZeroClue/zerochat-desktop
npm run tauri dev
```

### 4. Manual Testing Checklist

#### Onboarding
- [ ] Enter base URL and username
- [ ] Click "Sign Up & Start"
- [ ] App should provision, upload keys, and show main UI

#### Chats Tab
- [ ] Select a friend from dropdown
- [ ] Type and send a message
- [ ] Verify message appears in chat
- [ ] Check that pull loop shows incoming messages
- [ ] Verify checkmark appears after message is acked

#### Contacts Tab
- [ ] Add a friend by username
- [ ] Verify pending request appears
- [ ] Accept/reject pending requests
- [ ] Verify accepted friends appear in list
- [ ] Click "Message" button to switch to Chats tab

#### Profile Tab
- [ ] Verify username and device_id are displayed
- [ ] Click "Copy Deep Link" - verify link is copied
- [ ] Click "Copy Landing Link" - verify link is copied
- [ ] Click "Copy Add-Friend Link" - verify link is copied
- [ ] Verify invite links are displayed

#### Deep Links
- [ ] Test provision link:
  ```bash
  open 'zerochat://provision?token=...&base=http://127.0.0.1:8080'
  ```
- [ ] Test add-friend link:
  ```bash
  open 'zerochat://addfriend?u=alice&base=http://127.0.0.1:8080'
  ```
- [ ] Verify app opens and handles the link correctly

#### Landing Page
- [ ] Visit: `http://127.0.0.1:8080/invite.html?token=...&base=...&friend=alice`
- [ ] Verify page loads and shows deep link
- [ ] Click "Open in ZeroChat" button
- [ ] Verify app opens (if installed)

### 5. Build DMG

```bash
cd ~/Desktop/ZeroClue/zerochat-desktop
npm run build:app
```

Output: `src-tauri/target/release/bundle/dmg/ZeroChat_0.1.0_x64.dmg`

### 6. API Testing

#### Signup
```bash
curl -X POST http://127.0.0.1:8080/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'
```

#### Create Invite (requires auth)
```bash
# First get device_id and device_auth from signup+redeem
curl -X POST http://127.0.0.1:8080/api/invite/create \
  -H "x-device-id: <uuid>" \
  -H "x-device-auth: <token>" \
  -H "Content-Type: application/json" \
  -d '{"ttl_minutes": 60}'
```

#### Get Profile
```bash
curl http://127.0.0.1:8080/api/me \
  -H "x-device-id: <uuid>" \
  -H "x-device-auth: <token>"
```

## Known Issues

1. **macOS Private API Warning**: The desktop app build shows a warning about `macos-private-api`. This is expected and deep links work when running `tauri dev` or when the feature is enabled.

2. **Static File Serving**: The `/static` route serves files from `server/static/`. The `/invite.html` route uses a handler function, but the static version is also available.

## Troubleshooting

### Server won't start
- Check database connection in `.env`
- Verify migrations ran: `cd server && sqlx migrate run`
- Check port 8080 is available

### Desktop app won't build
- Run `npm install` in `zerochat-desktop/`
- Check Rust toolchain: `rustc --version`
- For deep links, ensure you're running `tauri dev` not just `cargo build`

### Deep links don't work
- On macOS, the scheme is registered when app is installed
- For testing, use `tauri dev` which enables deep link handling
- Check that URL format is correct: `zerochat://provision?token=...&base=...`


