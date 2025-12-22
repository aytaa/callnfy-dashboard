# Integrations API Specification

This document specifies the backend API endpoints required for the Integrations feature.

## Base URL
All endpoints are relative to: `https://api.callnfy.com`

## Authentication
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## Endpoints

### 1. Get Integration Status
**GET** `/integrations/status`

Returns the connection status for all available integrations.

**Request:**
```http
GET /integrations/status HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "googleCalendar": {
      "connected": true,
      "email": "user@gmail.com",
      "syncMode": "one-way",
      "lastSyncAt": "2025-12-22T10:30:00.000Z"
    },
    "zapier": {
      "connected": true,
      "apiKey": "czp_1234567890abcdef",
      "webhookUrl": "https://api.callnfy.com/webhooks/zapier/user_123",
      "createdAt": "2025-12-15T08:00:00.000Z"
    }
  }
}
```

**Response when not connected:**
```json
{
  "success": true,
  "data": {
    "googleCalendar": {
      "connected": false
    },
    "zapier": {
      "connected": false
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized"
  }
}
```

---

## Google Calendar Integration

### 2. Connect Google Calendar
**POST** `/integrations/google/connect`

Initiates Google OAuth flow by returning the authorization URL.

**Request:**
```http
POST /integrations/google/connect HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&scope=calendar&state=..."
  }
}
```

**Frontend Behavior:**
- Redirect user to `authUrl`
- Google will redirect back to: `https://app.callnfy.com/settings/integrations?code=...&state=...`
- Backend should handle OAuth callback at `/integrations/google/callback`

**Error Response (500):**
```json
{
  "success": false,
  "error": {
    "message": "Failed to initiate Google OAuth"
  }
}
```

---

### 3. Google Calendar OAuth Callback
**GET** `/integrations/google/callback?code=...&state=...`

This endpoint is called by Google after user authorizes. Backend should:
1. Exchange code for access token
2. Store refresh token in database
3. Fetch user's Google email
4. Set `syncMode` default to "one-way"
5. Redirect to frontend with success/error

**Backend Implementation:**
```javascript
// Pseudo-code
app.get('/integrations/google/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    // Exchange code for tokens
    const tokens = await googleOAuth.getToken(code);

    // Get user info
    const userInfo = await googleCalendar.getUserInfo(tokens.access_token);

    // Save to database
    await db.integrations.create({
      userId: getUserIdFromState(state),
      provider: 'google_calendar',
      email: userInfo.email,
      accessToken: encrypt(tokens.access_token),
      refreshToken: encrypt(tokens.refresh_token),
      syncMode: 'one-way',
      connected: true,
    });

    // Redirect back to frontend
    res.redirect('https://app.callnfy.com/settings/integrations?success=true');
  } catch (error) {
    res.redirect('https://app.callnfy.com/settings/integrations?error=google_auth_failed');
  }
});
```

---

### 4. Disconnect Google Calendar
**DELETE** `/integrations/google/disconnect`

Removes Google Calendar integration.

**Request:**
```http
DELETE /integrations/google/disconnect HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Google Calendar disconnected successfully"
}
```

**Backend Behavior:**
- Delete stored tokens from database
- Revoke Google OAuth tokens (recommended)
- Stop any active sync jobs

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Google Calendar not connected"
  }
}
```

---

### 5. Update Google Calendar Settings
**PUT** `/integrations/google/settings`

Updates sync mode for Google Calendar integration.

**Request:**
```http
PUT /integrations/google/settings HTTP/1.1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "syncMode": "two-way"
}
```

**Request Body:**
```json
{
  "syncMode": "one-way" | "two-way"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "syncMode": "two-way"
  }
}
```

**Sync Mode Behavior:**
- **one-way**: Only sync Callnfy → Google (create events in Google when appointment created in Callnfy)
- **two-way**: Sync both ways (create appointment in Callnfy when event created in Google, and vice versa)

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid sync mode. Must be 'one-way' or 'two-way'"
  }
}
```

---

## Zapier Integration

### 6. Generate Zapier API Key
**POST** `/integrations/zapier/generate-key`

Generates a new API key for Zapier webhooks.

**Request:**
```http
POST /integrations/zapier/generate-key HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "apiKey": "czp_1234567890abcdefghijklmnopqrstuvwxyz",
    "webhookUrl": "https://api.callnfy.com/webhooks/zapier/user_123",
    "createdAt": "2025-12-22T10:45:00.000Z"
  }
}
```

**Backend Behavior:**
- Generate unique API key with prefix `czp_` (callnfy zapier)
- Store hashed version in database
- If key already exists, return existing key (don't regenerate)
- Webhook URL format: `https://api.callnfy.com/webhooks/zapier/{userId}`

**API Key Format:**
- Prefix: `czp_`
- Length: 40 characters (excluding prefix)
- Characters: alphanumeric (a-z, A-Z, 0-9)
- Example: `czp_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

**Error Response (500):**
```json
{
  "success": false,
  "error": {
    "message": "Failed to generate API key"
  }
}
```

---

### 7. Revoke Zapier API Key
**DELETE** `/integrations/zapier/revoke-key`

Revokes the current Zapier API key.

**Request:**
```http
DELETE /integrations/zapier/revoke-key HTTP/1.1
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Zapier API key revoked successfully"
}
```

**Backend Behavior:**
- Delete API key from database
- Invalidate all webhook requests using this key
- Return 200 even if no key exists

**Error Response (500):**
```json
{
  "success": false,
  "error": {
    "message": "Failed to revoke API key"
  }
}
```

---

## Zapier Webhook Events

When Zapier integration is enabled, the following events should be sent to the webhook URL:

### Webhook Authentication
All webhook requests should include the API key in the `X-Callnfy-Key` header:
```http
POST https://hooks.zapier.com/hooks/catch/... HTTP/1.1
X-Callnfy-Key: czp_1234567890abcdefghijklmnopqrstuvwxyz
Content-Type: application/json
```

### Event Types

#### 1. New Appointment Created
```json
{
  "event": "appointment.created",
  "timestamp": "2025-12-22T10:45:00.000Z",
  "data": {
    "id": "appt_123",
    "customerId": "cust_456",
    "customerName": "John Doe",
    "customerPhone": "+44 7700 900123",
    "scheduledAt": "2025-12-23T14:00:00.000Z",
    "duration": 30,
    "status": "scheduled",
    "notes": "First consultation"
  }
}
```

#### 2. Appointment Cancelled
```json
{
  "event": "appointment.cancelled",
  "timestamp": "2025-12-22T10:50:00.000Z",
  "data": {
    "id": "appt_123",
    "customerId": "cust_456",
    "customerName": "John Doe",
    "cancelledAt": "2025-12-22T10:50:00.000Z",
    "reason": "Customer requested cancellation"
  }
}
```

#### 3. Appointment Completed
```json
{
  "event": "appointment.completed",
  "timestamp": "2025-12-22T11:00:00.000Z",
  "data": {
    "id": "appt_123",
    "customerId": "cust_456",
    "customerName": "John Doe",
    "completedAt": "2025-12-22T11:00:00.000Z",
    "duration": 30
  }
}
```

#### 4. New Call Received
```json
{
  "event": "call.received",
  "timestamp": "2025-12-22T11:05:00.000Z",
  "data": {
    "id": "call_789",
    "customerId": "cust_456",
    "customerName": "John Doe",
    "customerPhone": "+44 7700 900123",
    "duration": 180,
    "recordingUrl": "https://api.callnfy.com/recordings/call_789.mp3",
    "transcript": "Full call transcript...",
    "sentiment": "positive"
  }
}
```

---

## Database Schema (Suggested)

### integrations Table
```sql
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'google_calendar', 'zapier'
  connected BOOLEAN DEFAULT false,

  -- Google Calendar fields
  google_email VARCHAR(255),
  google_access_token TEXT, -- Encrypted
  google_refresh_token TEXT, -- Encrypted
  google_sync_mode VARCHAR(20) DEFAULT 'one-way', -- 'one-way', 'two-way'
  google_last_sync_at TIMESTAMP,

  -- Zapier fields
  zapier_api_key_hash TEXT, -- SHA-256 hash of the API key
  zapier_webhook_url VARCHAR(255),
  zapier_created_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, provider)
);

-- Index for faster lookups
CREATE INDEX idx_integrations_user_provider ON integrations(user_id, provider);
CREATE INDEX idx_integrations_zapier_key ON integrations(zapier_api_key_hash);
```

---

## Google Calendar Sync Implementation

### When to Sync (One-way mode):
1. **Appointment Created** → Create Google Calendar event
2. **Appointment Updated** → Update Google Calendar event
3. **Appointment Cancelled** → Delete Google Calendar event

### When to Sync (Two-way mode):
All of the above, plus:
4. **Google Event Created** → Create Callnfy appointment (webhook from Google)
5. **Google Event Updated** → Update Callnfy appointment
6. **Google Event Deleted** → Cancel Callnfy appointment

### Google Calendar Event Format:
```javascript
{
  summary: `Appointment with ${customerName}`,
  description: `Callnfy appointment\nCustomer: ${customerName}\nPhone: ${customerPhone}\nNotes: ${notes}`,
  start: {
    dateTime: scheduledAt,
    timeZone: 'Europe/London',
  },
  end: {
    dateTime: scheduledAt + duration,
    timeZone: 'Europe/London',
  },
  attendees: [
    { email: customerEmail }
  ],
  reminders: {
    useDefault: true,
  },
}
```

---

## Testing Checklist

### Google Calendar:
- [ ] OAuth flow redirects correctly
- [ ] Access token is stored securely (encrypted)
- [ ] Email is displayed in frontend
- [ ] Disconnect removes tokens
- [ ] Sync mode can be toggled
- [ ] One-way sync creates Google events
- [ ] Two-way sync listens for Google events (if implemented)

### Zapier:
- [ ] API key is generated with correct format
- [ ] API key is stored as hash, not plaintext
- [ ] Webhook URL is correct
- [ ] Copy to clipboard works
- [ ] Revoke key invalidates existing webhooks
- [ ] Webhook events are sent for:
  - [ ] New appointment
  - [ ] Cancelled appointment
  - [ ] Completed appointment
  - [ ] New call received

---

## Security Considerations

1. **OAuth Tokens**: Store access/refresh tokens encrypted in database
2. **API Keys**: Store hashed (SHA-256), never plaintext
3. **Webhook Validation**: Verify `X-Callnfy-Key` header matches stored hash
4. **Rate Limiting**: Limit API key generation (max 1 per user)
5. **HTTPS Only**: All webhook URLs must use HTTPS
6. **Token Rotation**: Implement refresh token rotation for Google OAuth

---

## Error Handling

### Common Error Codes:
- `400` - Bad request (invalid parameters)
- `401` - Unauthorized (invalid/missing JWT)
- `404` - Integration not found
- `409` - Conflict (already connected)
- `500` - Internal server error

### Example Error Response:
```json
{
  "success": false,
  "error": {
    "code": "INTEGRATION_NOT_FOUND",
    "message": "Google Calendar is not connected",
    "details": "Please connect Google Calendar first"
  }
}
```

---

## Frontend Files Created

1. ✅ `src/slices/apiSlice/integrationsApiSlice.js` - RTK Query endpoints
2. ✅ `src/pages/settings/Integrations.jsx` - UI component
3. ✅ `src/layouts/SettingsLayout.jsx` - Added "Integrations" menu item
4. ✅ `src/App.jsx` - Added `/settings/integrations` route
5. ✅ `src/slices/apiSlice.js` - Added 'Integration' tag type

## Next Steps for Backend

1. Create database migration for `integrations` table
2. Implement Google OAuth flow (`/integrations/google/connect`, `/callback`)
3. Implement Zapier API key generation with secure hashing
4. Set up webhook sending for appointment/call events
5. Implement Google Calendar sync logic (one-way first, two-way optional)
6. Add tests for all endpoints
7. Deploy and test with frontend

---

**Generated with Claude Code** 🤖
