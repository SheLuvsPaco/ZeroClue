#!/bin/bash
# Setup a persistent dev account for testing

set -e

USERNAME="${1:-devuser}"
BASE_URL="${2:-http://127.0.0.1:8080}"
ADMIN_TOKEN="${ADMIN_TOKEN:-dev-admin-123}"

echo "Setting up dev account: $USERNAME"
echo "Base URL: $BASE_URL"
echo "Admin Token: $ADMIN_TOKEN"

# Provision the device
RESPONSE=$(curl -s -X POST "$BASE_URL/api/dev/provision_direct" \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -d "{\"username\": \"$USERNAME\", \"platform\": \"desktop\"}")

DEVICE_ID=$(echo "$RESPONSE" | jq -r '.device_id')
DEVICE_TOKEN=$(echo "$RESPONSE" | jq -r '.device_token')

if [ "$DEVICE_ID" = "null" ] || [ -z "$DEVICE_ID" ]; then
  echo "Error: Failed to provision device"
  echo "Response: $RESPONSE"
  exit 1
fi

# Save credentials
CREDS_DIR="$HOME/Library/Application Support/ZeroChat"
mkdir -p "$CREDS_DIR"

echo "$DEVICE_ID" > "$CREDS_DIR/device_id.txt"
echo "$DEVICE_TOKEN" > "$CREDS_DIR/token-$DEVICE_ID.txt"

echo ""
echo "✅ Dev account setup complete!"
echo "   Device ID: $DEVICE_ID"
echo "   Credentials saved to: $CREDS_DIR"
echo ""
echo "You can now use the desktop app without provisioning again."
echo "Just set the base URL to: $BASE_URL"


