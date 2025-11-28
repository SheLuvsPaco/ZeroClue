# ZeroChat Verify Checklist (Non-interactive)

All commands below are non-interactive and can be run end-to-end.

```bash
# From repo root

# 1) Build mac web and DMG (existing flow)
npx tauri info
cd zerochat-desktop
npm run build:mac -- --verbose
cd ..

# 2) Build Android debug APK
npm run build:web
npm run android:sync
npm run android:build:debug
npm run android:apk:export

# 3) Start server
cd server
cargo run
```

Then, in a browser:

```text
http://127.0.0.1:8080/invite.html?token=TEST_TOKEN&base=http://127.0.0.1:8080
```

- On **Android**: opening this URL should:
  - First attempt `zerochat://invite?token=...&base=...` (launching the app if installed).
  - If the app is not installed, within ~500ms the browser starts downloading the APK from `/download/android/latest`.

- After installing the APK, tapping the same invite link again:
  - Opens the Android app.
  - Passes `token` and `base` into the WebView via `window.onInviteParams`.
  - The app can then provision and use the shared chat UI for 1:1 chatting.
```*** End Patch```} ***!

