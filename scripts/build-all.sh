#!/bin/bash
set -euo pipefail

# Build everything: web UI, macOS DMG, Android APK, and copy to server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=========================================="
echo "Building ZeroChat - All Platforms"
echo "=========================================="

# Step 1: Build web UI
echo ""
echo ">> Step 1: Building web UI..."
cd "$PROJECT_ROOT/zerochat-desktop"
npm run build

if [ ! -d "dist" ]; then
  echo "ERROR: dist directory not created"
  exit 1
fi

# Step 2: Copy UI to Android assets
echo ""
echo ">> Step 2: Copying UI to Android assets..."
cd "$PROJECT_ROOT"
node scripts/copy-ui-to-android.js

# Step 3: Build Android APK
echo ""
echo ">> Step 3: Building Android APK..."
cd "$PROJECT_ROOT/zerochat-android"
./gradlew clean assembleDebug

APK_FILE="$PROJECT_ROOT/zerochat-android/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$APK_FILE" ]; then
  echo "ERROR: APK file not found at $APK_FILE"
  exit 1
fi

echo "✅ Android APK built: $APK_FILE"

# Step 4: Build macOS DMG
echo ""
echo ">> Step 4: Building macOS DMG..."
cd "$PROJECT_ROOT/zerochat-desktop"
npm run build:mac

DMG_FILE=$(find "$PROJECT_ROOT/zerochat-desktop/src-tauri/target/release/bundle/dmg" -name "ZeroChat_*.dmg" 2>/dev/null | head -1)
if [ -z "$DMG_FILE" ]; then
  echo "WARNING: DMG file not found (this is okay if not on macOS)"
else
  echo "✅ macOS DMG built: $DMG_FILE"
fi

# Step 5: Copy to server
echo ""
echo ">> Step 5: Copying artifacts to server..."
mkdir -p "$PROJECT_ROOT/server/static/downloads/macos"
mkdir -p "$PROJECT_ROOT/server/static/downloads/android"

# Copy APK
cp "$APK_FILE" "$PROJECT_ROOT/server/static/downloads/android/ZeroChat-latest.apk"
echo "✅ Copied APK to server/static/downloads/android/ZeroChat-latest.apk"

# Copy DMG if it exists
if [ -n "$DMG_FILE" ]; then
  cp "$DMG_FILE" "$PROJECT_ROOT/server/static/downloads/macos/ZeroChat-latest.dmg"
  echo "✅ Copied DMG to server/static/downloads/macos/ZeroChat-latest.dmg"
fi

echo ""
echo "=========================================="
echo "✅ Build Complete!"
echo "=========================================="
echo "Android APK: server/static/downloads/android/ZeroChat-latest.apk"
if [ -n "$DMG_FILE" ]; then
  echo "macOS DMG: server/static/downloads/macos/ZeroChat-latest.dmg"
fi

