# ZeroChat - Quick Start Guide

## 🎯 Get Up and Running in 5 Minutes!

### ✅ Current Status
- ✅ Database is running (PostgreSQL + Redis)
- ✅ All migrations applied
- ✅ Ready for development!

---

## 🚀 1. Database is Already Running!

Your PostgreSQL database and Redis are already set up and running:

```bash
# Check status
docker compose ps
```

**Connection Details:**
- **Database URL**: `postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat`
- **Redis URL**: `redis://localhost:6379`

---

## 🔨 2. Build and Run the Server

```bash
# Set the DATABASE_URL environment variable
export DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat"
export REDIS_URL="redis://localhost:6379"

# Build the server (this will take a few minutes first time)
cargo build --release

# Run the server
cargo run --release
```

The server will start on `http://localhost:8080`

---

## 🖥️ 3. Build the Desktop App

```bash
cd zerochat-desktop

# Install dependencies (first time only)
npm install

# Run in development mode
npm run tauri dev

# Or build for production
npm run tauri build
```

---

## 📱 4. Build the Android App

```bash
cd zerochat-android

# Build APK
./gradlew assembleDebug

# The APK will be in:
# app/build/outputs/apk/debug/app-debug.apk
```

---

## 🧪 5. Test the Invite Flow

### Test Scenario: Alice invites Bob

1. **User A (Alice) signs up:**
   - Open desktop app
   - Click "Sign Up"
   - Username: `alice`
   - Password: `password123`
   - ✅ Alice is now logged in

2. **Alice creates invite link:**
   - Go to Settings
   - Click "Create Invite Link"
   - Copy the link (e.g., `http://localhost:8080/invite.html?token=...&inviter=alice`)

3. **User B (Bob) uses invite:**
   - Open the invite link in browser
   - Click "Download ZeroChat" (or "Open in ZeroChat" if installed)
   - App opens to signup screen
   - Username: `bob`
   - Password: `password456`
   - ✅ Bob is now logged in AND automatically friends with Alice!

4. **Verify auto-friending worked:**
   - Bob's contacts should show Alice
   - Alice's contacts should show Bob
   - They can now chat!

---

## 📊 6. Check Database Status

```bash
# View all users
docker compose exec db psql -U zerochat_user -d zerochat -c "SELECT id, username, created_at FROM users;"

# View friendships
docker compose exec db psql -U zerochat_user -d zerochat -c "
SELECT
    f.id,
    u1.username as requester,
    u2.username as addressee,
    f.status
FROM friendships f
JOIN users u1 ON f.requester = u1.id
JOIN users u2 ON f.addressee = u2.id;
"

# View provision tokens
docker compose exec db psql -U zerochat_user -d zerochat -c "
SELECT
    id,
    user_id,
    purpose,
    inviter_username,
    expires_at > now() as is_valid,
    used_at IS NOT NULL as is_used
FROM provision_tokens
ORDER BY created_at DESC
LIMIT 10;
"
```

---

## 🛠️ Common Commands

### Database Management
```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View logs
docker compose logs -f db

# Database shell
docker compose exec db psql -U zerochat_user -d zerochat

# Backup database
./scripts/db-backup.sh

# Reset database (⚠️ deletes all data!)
./scripts/db-reset.sh
```

### Server
```bash
# Development mode (with hot reload)
cargo watch -x run

# Production build
cargo build --release

# Check logs
tail -f server.log
```

### Desktop App
```bash
cd zerochat-desktop

# Dev mode
npm run tauri dev

# Build
npm run tauri build
```

### Android App
```bash
cd zerochat-android

# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Check if database is running
docker compose ps

# Try setting the URL and restarting
export DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat"
cargo run
```

### "Can't connect to database"
```bash
# Check database is running
docker compose ps

# Test connection
docker compose exec db psql -U zerochat_user -d zerochat -c "SELECT 1;"

# Restart database
docker compose restart db
```

### Migrations failed
```bash
# Re-run migrations manually
for file in migrations/*.sql; do
    docker compose exec -T db psql -U zerochat_user -d zerochat < "$file"
done
```

### App can't find invite token
- Check browser console for errors
- Verify localStorage has `zerochat_pending_invite_token`
- Try clearing browser cache and clicking invite link again

---

## ✅ Success Checklist

Before reporting issues, verify:

- [ ] Database is running: `docker compose ps` shows `zerochat-postgres` as `healthy`
- [ ] Migrations applied: `docker compose exec db psql -U zerochat_user -d zerochat -c "\dt"` shows 8 tables
- [ ] Server starts without errors
- [ ] Desktop app builds successfully
- [ ] Can create user account
- [ ] Can create invite link
- [ ] Invite link opens correctly
- [ ] New user can sign up with invite
- [ ] Auto-friending works (both users see each other)

---

## 📚 More Documentation

- **Full Database Guide**: See `DATABASE_SETUP.md`
- **Architecture**: See main README (if exists)
- **API Docs**: Check `server/src/routes/` for endpoint details

---

## 🎉 You're All Set!

Your ZeroChat app is ready for development. Start building!

**Key Changes Made:**
- ✅ Fixed invite link flow (no more anonymous users)
- ✅ Upgraded to Argon2id password hashing
- ✅ Auto-friending works correctly
- ✅ All platforms (Desktop, Android) support invites
- ✅ Professional database setup with Docker

Happy coding! 🚀
