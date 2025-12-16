# ZeroChat API Routes Documentation

## Authentication Routes

### POST `/api/signup`
**Module:** `server/src/routes/auth.rs`
**Handler:** `signup`
**Authentication:** None
**Description:** Create a new user account
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "invite_token": "string (optional)"
}
```
**Response:**
```json
{
  "provision_token": "string"
}
```

### POST `/api/login`
**Module:** `server/src/routes/auth.rs`
**Handler:** `login`
**Authentication:** None
**Description:** Authenticate an existing user
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "provision_token": "string"
}
```

---

## Provisioning Routes

### POST `/api/provision/create`
**Module:** `server/src/main.rs`
**Handler:** `create_provision`
**Authentication:** Device Auth
**Description:** Create a new provision token for device setup

### POST `/api/provision/redeem`
**Module:** `server/src/main.rs`
**Handler:** `redeem_provision`
**Authentication:** None
**Description:** Redeem a provision token to get device credentials
**Request Body:**
```json
{
  "token": "string",
  "platform": "string",
  "push_token": "string (optional)"
}
```
**Response:**
```json
{
  "user_id": "uuid",
  "device_id": "uuid",
  "device_auth": "string"
}
```

---

## User Management Routes

### POST `/api/users`
**Module:** `server/src/main.rs`
**Handler:** `create_user`
**Authentication:** Device Auth
**Description:** Create a new user

### GET `/api/me`
**Module:** `server/src/routes/invite.rs`
**Handler:** `get_me`
**Authentication:** Device Auth
**Description:** Get current user profile
**Response:**
```json
{
  "username": "string",
  "device_id": "uuid"
}
```

---

## Friends Routes

### POST `/api/friends/request`
**Module:** `server/src/routes/friends.rs`
**Handler:** `request_friend`
**Authentication:** Device Auth
**Description:** Send a friend request
**Request Body:**
```json
{
  "to_username": "string"
}
```

### POST `/api/friends/respond`
**Module:** `server/src/routes/friends.rs`
**Handler:** `respond_friend`
**Authentication:** Device Auth
**Description:** Respond to a friend request
**Request Body:**
```json
{
  "from_username": "string",
  "accept": boolean
}
```

### GET `/api/friends/list`
**Module:** `server/src/routes/friends.rs`
**Handler:** `list_friends`
**Authentication:** Device Auth
**Description:** List all friends and friend requests
**Response:**
```json
{
  "friends": [
    {
      "username": "string",
      "status": "pending | accepted | blocked"
    }
  ]
}
```

---

## Messaging Routes

### POST `/api/messages/enqueue`
**Module:** `server/src/main.rs`
**Handler:** `enqueue_message`
**Authentication:** Device Auth
**Description:** Send an encrypted message
**Request Body:**
```json
{
  "to_user_id": "uuid",
  "ciphertext_b64": "string"
}
```

### POST `/api/messages/pull`
**Module:** `server/src/main.rs`
**Handler:** `pull_messages`
**Authentication:** Device Auth
**Description:** Pull pending messages for the authenticated device
**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "from_user_id": "uuid",
      "ciphertext_b64": "string",
      "created_at": "timestamp"
    }
  ]
}
```

### POST `/api/messages/send_username`
**Module:** `server/src/routes/messages_extra.rs`
**Handler:** `send_username`
**Authentication:** Device Auth
**Description:** Send message by username (convenience endpoint)

### POST `/api/messages/ack`
**Module:** `server/src/routes/messages_extra.rs`
**Handler:** `ack_messages`
**Authentication:** Device Auth
**Description:** Acknowledge receipt of messages

---

## Cryptographic Key Routes

### POST `/api/keys/set_identity`
**Module:** `server/src/main.rs`
**Handler:** `set_identity_key`
**Authentication:** Device Auth
**Description:** Upload user's identity key

### POST `/api/keys/upload_keypackage`
**Module:** `server/src/main.rs`
**Handler:** `upload_keypackage`
**Authentication:** Device Auth
**Description:** Upload key packages for message encryption

### POST `/api/keys/fetch_for_user`
**Module:** `server/src/main.rs`
**Handler:** `fetch_keypackages_for_user`
**Authentication:** Device Auth
**Description:** Fetch key packages for a specific user

### POST `/api/keys/mark_used`
**Module:** `server/src/main.rs`
**Handler:** `mark_keypackage_used`
**Authentication:** Device Auth
**Description:** Mark a key package as used

---

## Invite Routes

### POST `/api/invite/create`
**Module:** `server/src/routes/invite.rs`
**Handler:** `create_invite`
**Authentication:** Device Auth
**Description:** Create an invite link
**Request Body:**
```json
{
  "friend_hint": "string (optional)",
  "ttl_minutes": number
}
```
**Response:**
```json
{
  "invite_link": "string"
}
```

### GET `/invite.html`
**Module:** `server/src/routes/invite.rs`
**Handler:** `serve_invite_page`
**Authentication:** None
**Description:** Serve invite landing page

---

## Download Routes

### GET `/download/latest`
**Module:** `server/src/routes/invite.rs`
**Handler:** `download_latest`
**Authentication:** None
**Description:** Auto-detect platform and redirect to appropriate download

### GET `/download/macos/latest`
**Module:** `server/src/routes/download.rs`
**Handler:** `download_dmg`
**Authentication:** None
**Description:** Download macOS DMG installer

### GET `/download/android/latest`
**Module:** `server/src/routes/download.rs`
**Handler:** `download_apk`
**Authentication:** None
**Description:** Download Android APK

### GET `/download/windows/latest`
**Module:** `server/src/routes/download.rs`
**Handler:** `download_windows`
**Authentication:** None
**Description:** Download Windows installer

---

## Health Check Routes

### GET `/healthz`
**Module:** `server/src/main.rs`
**Authentication:** None
**Description:** Basic health check endpoint
**Response:** `"ok"`

### GET `/readyz`
**Module:** `server/src/main.rs`
**Handler:** `readyz`
**Authentication:** None
**Description:** Readiness probe - checks database connectivity

---

## Authentication Method

Most endpoints require device authentication via headers:
- `x-device-id`: UUID of the device
- `x-device-auth`: Authentication token for the device

These credentials are obtained by:
1. Signing up or logging in to get a provision token
2. Redeeming the provision token via `/api/provision/redeem`

---

## Error Responses

All endpoints may return standard HTTP error codes:
- `400 Bad Request` - Invalid request body or parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Not authorized for this resource
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate username)
- `500 Internal Server Error` - Server error
