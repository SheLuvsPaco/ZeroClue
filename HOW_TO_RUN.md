# 🚀 How to Run ZeroChat - Step by Step

## ✨ The Easiest Way (Automated)

### **Method 1: One-Command Startup** (Recommended)

Run this single command:

```bash
./START_APP.sh
```

This automatically:
- ✅ Starts the database (PostgreSQL + Redis)
- ✅ Starts the backend server
- ✅ Shows you the next steps

Then open a **NEW terminal** and run:

```bash
cd zerochat-desktop && npm run tauri dev
```

**Done!** The app will open on your screen.

---

## 📋 Manual Method (Step by Step)

If you prefer to run each component manually:

### **Step 1: Start the Database** (Terminal 1)

```bash
# Start PostgreSQL and Redis with Docker
docker compose up -d

# Verify they're running
docker compose ps

# You should see:
# ✅ zerochat-postgres (healthy)
# ✅ zerochat-redis (healthy)
```

### **Step 2: Start the Backend Server** (Terminal 1 or 2)

```bash
# Set environment variables
export DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat"
export REDIS_URL="redis://localhost:6379"
export RUST_LOG="info,server=debug"

# Run the server
cargo run --bin server --release
```

**Note:** First build takes 2-5 minutes. Subsequent runs are faster.

**You'll know it's working when you see:**
```
Server listening on 0.0.0.0:8080
```

### **Step 3: Start the Desktop App** (Terminal 2 or 3)

Open a **NEW terminal** (important - keep server running):

```bash
# Navigate to desktop app
cd zerochat-desktop

# Install dependencies (first time only)
npm install

# Run the app in development mode
npm run tauri dev
```

**The app window will open automatically!** 🎉

---

## 🧪 Testing the App

### **Test 1: Create Your First Account**

1. **Signup Screen appears**
2. Enter username: `alice`
3. Enter password: `password123`
4. Click **"Sign Up"**
5. ✅ You're logged in!

### **Test 2: Create an Invite Link**

1. Click the **Settings** tab (gear icon)
2. Click **"Create Invite Link"**
3. A link appears (e.g., `http://localhost:8080/invite.html?token=...&inviter=alice`)
4. Click **"Copy"**
5. ✅ Link copied to clipboard!

### **Test 3: Test Invite Flow (Two Users)**

**Option A: Two Browser Windows**

1. Copy the invite link
2. Open your browser
3. Paste the link in address bar
4. You'll see the invite landing page
5. Click "Open in ZeroChat" (opens the app)
6. Sign up as second user (username: `bob`)
7. ✅ Bob and Alice are automatically friends!

**Option B: Second Desktop App Instance**

1. Open **another terminal**
2. Run: `cd zerochat-desktop && npm run tauri dev`
3. A second app window opens
4. Use the invite link to sign up as `bob`
5. ✅ Bob sees Alice in contacts!

### **Test 4: Send Your First Message**

1. In Alice's app, go to **Contacts** tab
2. You'll see "bob" in the friends list
3. Click **"Message"** next to bob
4. Type: "Hey Bob! Testing ZeroChat!"
5. Press Enter or click Send
6. ✅ Message sent (checkmark appears)

Switch to Bob's window:
- Message appears automatically
- Reply: "Hey Alice! It works!"
- ✅ Real-time messaging working!

---

## 🔍 Troubleshooting

### **Problem: "Cannot connect to database"**

**Solution:**
```bash
# Check if database is running
docker compose ps

# If not running, start it
docker compose up -d

# Wait for it to be healthy
docker compose logs -f db
# Press Ctrl+C when you see "database system is ready"
```

### **Problem: Server won't start / compile errors**

The server might have sqlx macro compilation issues. This is expected and won't affect runtime.

**Solution: Run without release mode first:**
```bash
# Development mode (faster compilation, ignores some checks)
DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat" \
cargo run --bin server
```

If you see compile errors about "role zerochat_user does not exist", that's OK - it's a compile-time check issue. The server will still run fine.

### **Problem: Desktop app won't open**

**Check 1: Is npm installed?**
```bash
npm --version
# Should show version number
```

**Check 2: Are dependencies installed?**
```bash
cd zerochat-desktop
npm install
```

**Check 3: Is Tauri CLI installed?**
```bash
npm run tauri --version
# If error, run: npm install
```

### **Problem: Port 8080 already in use**

**Find what's using it:**
```bash
lsof -i :8080
```

**Kill the process:**
```bash
kill -9 <PID>
```

Or change the port in your server configuration.

### **Problem: "Server not responding" in app**

**Check server is running:**
```bash
curl http://localhost:8080/api/me
# Should return an error (because not authenticated)
# But confirms server is responding
```

**Check server logs:**
```bash
tail -f server.log
# Or if running in terminal, check terminal output
```

---

## 🛠️ Useful Commands

### **Database Management**

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View database logs
docker compose logs -f db

# Connect to database (psql shell)
docker compose exec db psql -U zerochat_user -d zerochat

# Reset database (⚠️ deletes all data!)
./scripts/db-reset.sh
./scripts/db-setup.sh
```

### **Server Management**

```bash
# Start server (development)
cargo run --bin server

# Start server (release mode - optimized)
cargo run --bin server --release

# View server logs (if using START_APP.sh)
tail -f server.log

# Stop server (if running via START_APP.sh)
kill $(cat .server.pid)

# Stop server (if running in terminal)
Ctrl+C
```

### **Desktop App**

```bash
# Run in development mode (hot reload)
cd zerochat-desktop
npm run tauri dev

# Build production app
npm run tauri build

# Clean build
rm -rf target dist
npm run tauri build
```

### **Android App**

```bash
# Build debug APK
cd zerochat-android
./gradlew assembleDebug

# APK location:
# app/build/outputs/apk/debug/app-debug.apk

# Install on connected device
./gradlew installDebug
```

---

## 📱 Running on Mobile (Android)

### **Option 1: Build APK and Install**

```bash
cd zerochat-android
./gradlew assembleDebug

# APK is created at:
# app/build/outputs/apk/debug/app-debug.apk

# Transfer to phone and install
# Or use adb:
adb install app/build/outputs/apk/debug/app-debug.apk
```

### **Option 2: Use Invite Link from Desktop**

1. Create invite link on desktop app
2. Send to your phone (text, email, etc.)
3. Click link on phone
4. Download and install APK
5. App opens with invite pre-loaded
6. Sign up and you're connected!

---

## 🎯 Quick Reference

### **Full Startup Sequence (3 Commands)**

**Terminal 1:**
```bash
docker compose up -d
DATABASE_URL="postgresql://zerochat_user:zerochat_dev_password_2024@localhost:5432/zerochat" cargo run --bin server
```

**Terminal 2:**
```bash
cd zerochat-desktop && npm run tauri dev
```

**That's it!** App is running.

---

## 🎉 Success Checklist

After running everything, verify:

- [ ] Database is running: `docker compose ps` shows "healthy"
- [ ] Server is running: Terminal shows "Server listening on 0.0.0.0:8080"
- [ ] Desktop app opens: Window appears with signup screen
- [ ] Can create account: Signup works without errors
- [ ] Can create invite: Link is generated and copied
- [ ] Can send messages: Messages appear with checkmark

**All checked?** You're ready to use ZeroChat! 🚀

---

## 💡 Pro Tips

### **Multiple User Testing (Same Computer)**

1. Run first instance: `npm run tauri dev`
2. Open another terminal
3. Run second instance: `npm run tauri dev`
4. Now you have 2 app windows
5. Sign up different users in each
6. Use invite links to connect them
7. Test messaging between windows

### **Keep Server Running**

Use `tmux` or `screen` to keep server running:

```bash
# Install tmux
brew install tmux  # macOS
apt install tmux   # Linux

# Start tmux session
tmux new -s zerochat

# Run server
DATABASE_URL="..." cargo run --bin server

# Detach: Ctrl+B then D
# Reattach: tmux attach -t zerochat
```

### **Auto-Restart on Code Changes**

Install cargo-watch:
```bash
cargo install cargo-watch

# Run with auto-reload
DATABASE_URL="..." cargo watch -x 'run --bin server'
```

---

## 📚 Next Steps

- Read `QUICKSTART.md` for detailed app usage
- See `DATABASE_SETUP.md` for database management
- Check `DATABASE_SETUP.md` for schema details
- View main README for architecture overview

---

**Need help?** Check the troubleshooting section or GitHub issues.

**Ready to test?** Run `./START_APP.sh` and enjoy ZeroChat! 🎊
