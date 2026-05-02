# KALEIDO Auth API Specification

Base URL: `http://localhost:5001/api/auth`

## Authentication Flow
KALEIDO uses a **Session-based Drift Protocol**. Tokens are valid for 7 days.

### 1. Signup Ritual
- **POST `/signup/initiate`**
  - Body: `{ email, password }`
  - Effect: Creates ghost user, assigns time-based crystal, sends 6-digit code.
- **POST `/signup/verify`**
  - Body: `{ email, verificationCode }`
  - Effect: Seals anchor, returns session token.

### 2. Threshold Portal (Login)
- **POST `/login`**
  - Body: `{ email, password }`
  - Logic: Rate limited (3 attempts / 15 mins).
  - Returns: `sessionToken`, `anchorCrystalColor`, `crystalHexCode`, `anchorCrystalTier`.

### 3. Session Management
- **POST `/logout`** (Auth Required)
  - Effect: Ends drift, deletes session.
- **GET `/me`** (Auth Required)
  - Returns: Full traveler profile (User object).

### 4. Key Recovery (Password Reset)
- **POST `/forgot-password`**
  - Body: `{ email }`
  - Effect: Sends 32-char hex token via email.
- **POST `/reset-password`**
  - Body: `{ token, newPassword }`
  - Effect: Updates hash, kills all active sessions.

### 5. Profile & Void (Deletion)
- **PUT `/me/preferences`** (Auth Required)
  - Body: `{ motionReduction, highContrast, textScaling }`
- **DELETE `/me`** (Auth Required)
  - Header: `X-Confirm: permanently erase`
  - Effect: Soft deletes traveler, anonymizes echoes.

## Error Codes
- `401`: Key mismatched or drift expired.
- `403`: Anchor not sealed (Email not verified).
- `409`: Anchor already claimed.
- `429`: Vault locked (Rate limit).
