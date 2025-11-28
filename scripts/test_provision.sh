#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8080"

echo ">> /healthz: $(curl -s $BASE/healthz)"
echo ">> /readyz:  $(curl -s $BASE/readyz)"

USER_ID=$(curl -s -X POST $BASE/api/users \
  -H 'content-type: application/json' \
  -d '{"username":"alice"}' | jq -r .user_id)
echo ">> user_id: $USER_ID"

TOKEN=$(curl -s -X POST $BASE/api/provision/create \
  -H 'content-type: application/json' \
  -d "{\"user_id\":\"$USER_ID\",\"purpose\":\"install\",\"ttl_minutes\":5}" | jq -r .token)
echo ">> token: $TOKEN"

echo ">> redeeming..."
curl -s -X POST $BASE/api/provision/redeem \
  -H 'content-type: application/json' \
  -d "{\"token\":\"$TOKEN\",\"platform\":\"ios\"}"
echo
