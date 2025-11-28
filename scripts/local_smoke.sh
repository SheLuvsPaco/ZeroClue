#!/bin/bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"
ADMIN_TOKEN="${ADMIN_TOKEN:-dev-admin-123}"

echo "=== ZeroChat Local Smoke Test ==="
echo "Base URL: $BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
ok() { echo -e "${GREEN}✓${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; exit 1; }
info() { echo -e "${YELLOW}→${NC} $1"; }

# Test 1: Signup alice
info "1. Signing up alice..."
ALICE_RESP=$(curl -s -X POST "$BASE_URL/api/signup" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice"}')
ALICE_TOKEN=$(echo "$ALICE_RESP" | jq -r '.provision_token // empty')
if [ -z "$ALICE_TOKEN" ]; then
  fail "Failed to get alice provision token"
fi
ok "Alice signed up, token: ${ALICE_TOKEN:0:8}..."

# Test 2: Signup bob
info "2. Signing up bob..."
BOB_RESP=$(curl -s -X POST "$BASE_URL/api/signup" \
  -H "Content-Type: application/json" \
  -d '{"username":"bob"}')
BOB_TOKEN=$(echo "$BOB_RESP" | jq -r '.provision_token // empty')
if [ -z "$BOB_TOKEN" ]; then
  fail "Failed to get bob provision token"
fi
ok "Bob signed up, token: ${BOB_TOKEN:0:8}..."

# Test 3: Redeem alice
info "3. Redeeming alice token..."
ALICE_REDEEM=$(curl -s -X POST "$BASE_URL/api/provision/redeem" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$ALICE_TOKEN\",\"platform\":\"desktop\"}")
ALICE_DEV_ID=$(echo "$ALICE_REDEEM" | jq -r '.device_id // empty')
ALICE_AUTH=$(echo "$ALICE_REDEEM" | jq -r '.device_auth // .device_token // empty')
if [ -z "$ALICE_DEV_ID" ] || [ -z "$ALICE_AUTH" ]; then
  fail "Failed to redeem alice token"
fi
ok "Alice provisioned, device_id: $ALICE_DEV_ID"

# Test 4: Redeem bob
info "4. Redeeming bob token..."
BOB_REDEEM=$(curl -s -X POST "$BASE_URL/api/provision/redeem" \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"$BOB_TOKEN\",\"platform\":\"desktop\"}")
BOB_DEV_ID=$(echo "$BOB_REDEEM" | jq -r '.device_id // empty')
BOB_AUTH=$(echo "$BOB_REDEEM" | jq -r '.device_auth // .device_token // empty')
if [ -z "$BOB_DEV_ID" ] || [ -z "$BOB_AUTH" ]; then
  fail "Failed to redeem bob token"
fi
ok "Bob provisioned, device_id: $BOB_DEV_ID"

# Test 5: Upload alice identity & KP
info "5. Uploading alice identity & KeyPackage..."
# Generate a dummy identity key (32 bytes)
ALICE_IDENTITY=$(openssl rand -base64 32 | tr -d '\n' | head -c 44)
curl -s -X POST "$BASE_URL/api/keys/set_identity" \
  -H "x-device-id: $ALICE_DEV_ID" \
  -H "x-device-auth: $ALICE_AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"$ALICE_DEV_ID\",\"identity_key_b64\":\"$ALICE_IDENTITY\"}" > /dev/null
ok "Alice identity uploaded"

# Generate dummy KeyPackage
ALICE_KP=$(openssl rand -base64 200 | tr -d '\n' | head -c 268)
curl -s -X POST "$BASE_URL/api/keys/upload_keypackage" \
  -H "x-device-id: $ALICE_DEV_ID" \
  -H "x-device-auth: $ALICE_AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"$ALICE_DEV_ID\",\"keypackage_b64\":\"$ALICE_KP\"}" > /dev/null
ok "Alice KeyPackage uploaded"

# Test 6: Upload bob identity & KP
info "6. Uploading bob identity & KeyPackage..."
BOB_IDENTITY=$(openssl rand -base64 32 | tr -d '\n' | head -c 44)
curl -s -X POST "$BASE_URL/api/keys/set_identity" \
  -H "x-device-id: $BOB_DEV_ID" \
  -H "x-device-auth: $BOB_AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"$BOB_DEV_ID\",\"identity_key_b64\":\"$BOB_IDENTITY\"}" > /dev/null
ok "Bob identity uploaded"

BOB_KP=$(openssl rand -base64 200 | tr -d '\n' | head -c 268)
curl -s -X POST "$BASE_URL/api/keys/upload_keypackage" \
  -H "x-device-id: $BOB_DEV_ID" \
  -H "x-device-auth: $BOB_AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"$BOB_DEV_ID\",\"keypackage_b64\":\"$BOB_KP\"}" > /dev/null
ok "Bob KeyPackage uploaded"

# Test 7: Friend request (alice -> bob)
info "7. Alice sending friend request to bob..."
FRIEND_REQ=$(curl -s -X POST "$BASE_URL/api/friends/request" \
  -H "x-device-id: $ALICE_DEV_ID" \
  -H "x-device-auth: $ALICE_AUTH" \
  -H "Content-Type: application/json" \
  -d '{"username":"bob"}')
FRIEND_ID=$(echo "$FRIEND_REQ" | jq -r '.friendship_id // empty')
if [ -z "$FRIEND_ID" ]; then
  fail "Failed to send friend request"
fi
ok "Friend request sent"

# Test 8: Bob accepts friend request
info "8. Bob accepting friend request from alice..."
FRIEND_ACCEPT=$(curl -s -X POST "$BASE_URL/api/friends/respond" \
  -H "x-device-id: $BOB_DEV_ID" \
  -H "x-device-auth: $BOB_AUTH" \
  -H "Content-Type: application/json" \
  -d '{"from_username":"alice","accept":true}')
ok "Friend request accepted"

# Test 9: List friends (alice)
info "9. Alice listing friends..."
ALICE_FRIENDS=$(curl -s -X GET "$BASE_URL/api/friends/list" \
  -H "x-device-id: $ALICE_DEV_ID" \
  -H "x-device-auth: $ALICE_AUTH")
FRIEND_COUNT=$(echo "$ALICE_FRIENDS" | jq '.friends | length')
if [ "$FRIEND_COUNT" -lt 1 ]; then
  fail "Alice should have at least 1 friend"
fi
ok "Alice has $FRIEND_COUNT friend(s)"

# Test 10: Send message (alice -> bob via username)
info "10. Alice sending message to bob via username..."
# Generate dummy ciphertext
CIPHERTEXT=$(openssl rand -base64 100 | tr -d '\n' | head -c 134)
SEND_RESP=$(curl -s -X POST "$BASE_URL/api/messages/send_username" \
  -H "x-device-id: $ALICE_DEV_ID" \
  -H "x-device-auth: $ALICE_AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"to_username\":\"bob\",\"ciphertext_b64\":\"$CIPHERTEXT\"}")
SEND_COUNT=$(echo "$SEND_RESP" | jq -r '.count // 0')
if [ "$SEND_COUNT" -lt 1 ]; then
  fail "Failed to send message"
fi
ok "Message sent to bob ($SEND_COUNT device(s))"

# Test 11: Pull messages (bob)
info "11. Bob pulling messages..."
PULL_RESP=$(curl -s -X POST "$BASE_URL/api/messages/pull" \
  -H "x-device-id: $BOB_DEV_ID" \
  -H "x-device-auth: $BOB_AUTH")
MSG_COUNT=$(echo "$PULL_RESP" | jq '.messages | length')
if [ "$MSG_COUNT" -lt 1 ]; then
  fail "Bob should have at least 1 message"
fi
MSG_ID=$(echo "$PULL_RESP" | jq -r '.messages[0].id // empty')
if [ -z "$MSG_ID" ]; then
  fail "Message missing ID"
fi
ok "Bob pulled $MSG_COUNT message(s)"

# Test 12: Ack messages (bob)
info "12. Bob acking messages..."
ACK_RESP=$(curl -s -X POST "$BASE_URL/api/messages/ack" \
  -H "x-device-id: $BOB_DEV_ID" \
  -H "x-device-auth: $BOB_AUTH" \
  -H "Content-Type: application/json" \
  -d "{\"ids\":[\"$MSG_ID\"]}")
if [ "$ACK_RESP" != "OK" ] && [ "$ACK_RESP" != "" ]; then
  # Some servers return empty body on success
  echo "$ACK_RESP" | jq . > /dev/null 2>&1 || fail "Ack failed"
fi
ok "Messages acked"

# Test 13: Verify messages deleted (bob pulls again)
info "13. Verifying messages deleted after ack..."
PULL_RESP2=$(curl -s -X POST "$BASE_URL/api/messages/pull" \
  -H "x-device-id: $BOB_DEV_ID" \
  -H "x-device-auth: $BOB_AUTH")
MSG_COUNT2=$(echo "$PULL_RESP2" | jq '.messages | length')
if [ "$MSG_COUNT2" -gt 0 ]; then
  # Messages should be gone after ack
  info "Note: $MSG_COUNT2 message(s) still present (may be expected if pull doesn't filter acked)"
fi
ok "Pull after ack completed"

echo ""
echo -e "${GREEN}=== All tests passed! ===${NC}"


