#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."

# Ensure SDK path for Gradle (adjust if your SDK lives elsewhere)
echo "sdk.dir=$HOME/Library/Android/sdk" > zerochat-android/local.properties

# Create Gradle wrapper (pinned)
cd zerochat-android
gradle wrapper --gradle-version 8.7 --distribution-type all >/dev/null

./gradlew --no-daemon :app:assembleDebug

# Copy APK to server static downloads
cd ..
mkdir -p server/static/downloads/android
cp zerochat-android/app/build/outputs/apk/debug/app-debug.apk server/static/downloads/android/ZeroChat-latest.apk

echo "APK ready at server/static/downloads/android/ZeroChat-latest.apk"


