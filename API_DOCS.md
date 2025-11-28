# ZeroChat API Documentation

## Custom URL Scheme

ZeroChat uses the `zerochat://` custom URL scheme for deep linking:

- **Provision**: `zerochat://provision?token=<token>&base=<url>&friend=<username>`
  - Opens app, sets base URL, redeems token, uploads keys, optionally sends friend request
- **Add Friend**: `zerochat://addfriend?u=<username>&base=<url>`
  - Opens app, sets base URL, sends friend request to specified username

### macOS Registration

The custom scheme is registered in `tauri.conf.json` via the bundle identifier. On macOS, the scheme is automatically registered when the app is installed.

### Testing Deep Links

```bash
# Test add-friend link
open 'zerochat://addfriend?u=alice&base=http%3A%2F%2F127.0.0.1%3A8080'

# Test provision link (after getting token from /api/invite/create)
open 'zerochat://provision?token=...&base=http%3A%2F%2F127.0.0.1%3A8080'
```

## Authentication

All authenticated endpoints require two headers:

- `x-device-id: <uuid>` - The device UUID
- `x-device-auth: <opaque-token>` - The device authentication token

These are returned from `/api/provision/redeem` in the `device_auth` field (or `device_token` for backward compatibility).

If authentication fails, endpoints return `401 Unauthorized` with message "missing/invalid device auth".

## Invite Endpoints

All invite endpoints require authentication headers.

### POST /api/invite/create

Create an invite link for a new user.

**Request:**
```json
{
  "friend_hint": "alice",  // Optional: username hint
  "ttl_minutes": 60        // Optional: token TTL (default 60)
}
```

**Response:**
```json
{
  "deeplink": "zerochat://provision?token=...&base=...",
  "landing": "http://127.0.0.1:8080/invite.html?token=...&base=..."
}
```

The `base` URL is taken from:
1. `BASE_PUBLIC_URL` environment variable
2. `x-base-url` request header
3. Default: `http://127.0.0.1:8080`

### GET /api/me

Get current user's profile information.

**Response:**
```json
{
  "username": "alice",
  "device_id": "<uuid>"
}
```

### GET /invite.html

Static landing page for invites. Accepts query parameters:
- `token` - Provision token
- `base` - Server base URL
- `friend` - Optional friend username hint

The page detects the platform and shows appropriate download links, plus a button to open the deep link.

## Public Endpoints

### POST /api/signup

Public signup endpoint (no authentication required).

**Request:**
```json
{
  "username": "alice"
}
```

**Response:**
```json
{
  "provision_token": "abc123..."
}
```

**Validation:**
- Username must match regex: `^[a-z0-9_]{3,24}$`
- Returns `409 Conflict` if username already exists
- Provision token expires in 10 minutes

## Provisioning

### POST /api/provision/redeem

Redeem a provision token to create a device.

**Request:**
```json
{
  "token": "<provision_token>",
  "platform": "desktop",
  "push_token": null
}
```

**Response:**
```json
{
  "user_id": "<uuid>",
  "device_id": "<uuid>",
  "device_token": "<token>",  // Backward compat
  "device_auth": "<token>"    // Use this in x-device-auth header
}
```

## Friends

All friends endpoints require authentication headers.

### POST /api/friends/request

Send a friend request to a user by username.

**Request:**
```json
{
  "username": "bob"
}
```

**Response:**
```json
{
  "friendship_id": "<uuid>",
  "status": "pending"
}
```

### POST /api/friends/respond

Accept or reject a friend request.

**Request:**
```json
{
  "from_username": "alice",
  "accept": true
}
```

**Response:**
```json
{
  "friendship_id": "<uuid>",
  "status": "accepted"  // or "rejected"
}
```

### GET /api/friends/list

List all friendships (pending, accepted, rejected).

**Response:**
```json
{
  "friends": [
    {
      "username": "bob",
      "user_id": "<uuid>",
      "status": "accepted",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Messages

All message endpoints require authentication headers.

### POST /api/messages/send_username

Send a message to a user by username. Message is delivered to all active devices of the recipient.

**Request:**
```json
{
  "to_username": "bob",
  "ciphertext_b64": "<base64-encoded-ciphertext>",
  "expires_at": "2024-01-01T00:00:00Z"  // Optional ISO8601
}
```

**Response:**
```json
{
  "queued": true,
  "count": 2  // Number of devices message was sent to
}
```

### POST /api/messages/pull

Pull messages for the authenticated device. **Does NOT delete messages** (non-destructive).

**Response:**
```json
{
  "device_id": "<uuid>",
  "messages": [
    {
      "id": "<uuid>",
      "ciphertext_b64": "<base64-encoded-ciphertext>"
    }
  ]
}
```

### POST /api/messages/ack

Acknowledge messages (delete them and record receipts).

**Request:**
```json
{
  "ids": ["<uuid1>", "<uuid2>", ...]
}
```

**Response:**
- `200 OK` on success

Messages are deleted from the database and receipts are recorded.

## Backward Compatibility

The following endpoints remain unchanged for backward compatibility:

- `/api/provision/create` - Admin-gated token creation
- `/api/keys/*` - Key management endpoints
- `/api/messages/enqueue` - Direct device-to-device messaging (still requires auth headers)

## Error Responses

All endpoints return standard HTTP status codes:

- `400 Bad Request` - Invalid request format
- `401 Unauthorized` - Missing or invalid device auth
- `404 Not Found` - Resource not found
- `409 Conflict` - Username already exists (signup)
- `500 Internal Server Error` - Server error

