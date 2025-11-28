#!/bin/bash
set -euo pipefail

# Build and copy artifacts to server downloads directory
# This script builds both macOS DMG and Android APK, then copies them to server

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo ">> Building ZeroChat artifacts..."

# Build web UI first (shared by both platforms)
echo ">> Building web UI..."
cd "$PROJECT_ROOT/zerochat-desktop"
npm run build

# Build macOS DMG
echo ">> Building macOS DMG..."
npm run build:mac

# Find the DMG file
DMG_FILE=$(find "$PROJECT_ROOT/zerochat-desktop/src-tauri/target/release/bundle/dmg" -name "ZeroChat_*.dmg" | head -1)
if [ -z "$DMG_FILE" ]; then
  echo "ERROR: DMG file not found"
  exit 1
fi

echo ">> Found DMG: $DMG_FILE"

# Build Android APK
echo ">> Building Android APK..."
cd "$PROJECT_ROOT/zerochat-android"
./gradlew assembleDebug

APK_FILE="$PROJECT_ROOT/zerochat-android/app/build/outputs/apk/debug/app-debug.apk"
if [ ! -f "$APK_FILE" ]; then
  echo "ERROR: APK file not found"
  exit 1
fi

echo ">> Found APK: $APK_FILE"

# Copy UI to Android assets
echo ">> Copying web UI to Android assets..."
cd "$PROJECT_ROOT"
node scripts/copy-ui-to-android.js

# Rebuild APK with updated UI
echo ">> Rebuilding Android APK with updated UI..."
cd "$PROJECT_ROOT/zerochat-android"
./gradlew assembleDebug

# Create server downloads directories
echo ">> Creating server download directories..."
mkdir -p "$PROJECT_ROOT/server/static/downloads/macos"
mkdir -p "$PROJECT_ROOT/server/static/downloads/android"

# Copy DMG to server
echo ">> Copying DMG to server..."
cp "$DMG_FILE" "$PROJECT_ROOT/server/static/downloads/macos/ZeroChat-latest.dmg"
echo "✅ Copied DMG to server/static/downloads/macos/ZeroChat-latest.dmg"

# Copy APK to server
echo ">> Copying APK to server..."
cp "$APK_FILE" "$PROJECT_ROOT/server/static/downloads/android/ZeroChat-latest.apk"
echo "✅ Copied APK to server/static/downloads/android/ZeroChat-latest.apk"

echo ""
echo "✅ Build complete!"
echo "   macOS: server/static/downloads/macos/ZeroChat-latest.dmg"
echo "   Android: server/static/downloads/android/ZeroChat-latest.apk"

