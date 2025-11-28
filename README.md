# ZeroChat

Secure, end-to-end encrypted messaging desktop application.

## Features

- **End-to-end encryption** using HPKE (Hybrid Public Key Encryption)
- **Device-based authentication** with persistent tokens
- **Friend management** with request/accept workflow
- **Deep linking** for easy onboarding and friend invites
- **Cross-platform** desktop app (macOS, Windows, Linux)

## Architecture

- **Server**: Rust (Axum) with PostgreSQL
- **Desktop**: Tauri (Rust + TypeScript/HTML)
- **Encryption**: HPKE with X25519 and ChaCha20Poly1305

## Quick Start

### Prerequisites

- Rust (latest stable)
- Node.js 18+
- PostgreSQL 14+
- Redis (for future features)

### Server Setup

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env with your database credentials

# 2. Run migrations
cd server
sqlx migrate run

# 3. Start server
cd ..
set -a; source .env; set +a
cargo run -p server
```

Server runs on `http://127.0.0.1:8080` by default.

### Desktop Setup

```bash
cd zerochat-desktop
npm install
npm run tauri dev
```

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete API reference.

### Key Endpoints

- `POST /api/signup` - Public signup (no auth required)
- `POST /api/provision/redeem` - Redeem provision token
- `GET /api/me` - Get current user profile
- `POST /api/invite/create` - Create invite link
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/respond` - Accept/reject request
- `GET /api/friends/list` - List all friendships
- `POST /api/messages/send_username` - Send message by username
- `POST /api/messages/pull` - Pull messages (non-destructive)
- `POST /api/messages/ack` - Acknowledge messages

### Authentication

All authenticated endpoints require headers:
- `x-device-id: <uuid>`
- `x-device-auth: <token>`

## Custom URL Scheme

ZeroChat uses `zerochat://` for deep linking:

- **Provision**: `zerochat://provision?token=<token>&base=<url>&friend=<username>`
- **Add Friend**: `zerochat://addfriend?u=<username>&base=<url>`

### Testing Deep Links

```bash
# macOS
open 'zerochat://addfriend?u=alice&base=http%3A%2F%2F127.0.0.1%3A8080'

# Linux
xdg-open 'zerochat://addfriend?u=alice&base=http%3A%2F%2F127.0.0.1%3A8080'
```

## Building

### Server

```bash
cargo build -p server --release
```

### Desktop App

```bash
cd zerochat-desktop
npm run build:mac
```

This builds the app and automatically copies the DMG to `server/static/downloads/macos/ZeroChat-latest.dmg`.

**Verify DMG exists:**
```bash
cd zerochat-desktop
npm run check:dmg
```

**Outputs:**
- macOS: `server/static/downloads/macos/ZeroChat-latest.dmg` (auto-copied)
- Original build: `src-tauri/target/release/bundle/dmg/Zerochat Desktop_0.1.0_aarch64.dmg`

## Invite Links

### Creating Invites

1. Open Profile tab in app
2. Click "Copy Deep Link" or "Copy Landing Link"
3. Share the link

### Landing Page

The server serves `/invite.html` which:
- Provides "Open in ZeroChat" button (uses custom protocol)
- Provides "Download for Desktop" button (direct download, no JS gymnastics)
- Displays QR code for scanning

**Usage:**
1. Build the app: `cd zerochat-desktop && npm run build:mac`
2. Start server and open: `http://127.0.0.1:8080/invite.html?token=...&base=...&inviter=...`
3. Click "Download for Desktop" to immediately download the DMG

Example: `http://127.0.0.1:8080/invite.html?token=...&base=...&inviter=alice`

## Development

### Running Tests

```bash
# Server smoke test
./scripts/local_smoke.sh
```

### Database Migrations

```bash
cd server
sqlx migrate add <name>
sqlx migrate run
```

## Security Notes

- Device auth tokens are hashed with SHA256 (consider upgrading to Argon2)
- Provision tokens expire after 10 minutes (signup) or 60 minutes (invites)
- Messages are encrypted with HPKE before transmission
- Messages are deleted after acknowledgment

## License

[Your License Here]

