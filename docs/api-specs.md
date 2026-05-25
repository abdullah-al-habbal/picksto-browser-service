# API Specification — picksto-browser-service

Base URL: `http://<host>:<port>/api`

Authentication: `X-API-Secret` header (required on all endpoints except `/health`).

---

## POST /api/extract-preview

Extract Open Graph / meta-data from a URL.

### Request

```json
{
  "url": "https://example.com/download-file",
  "siteSource": "Freepik"
}
```

### Response (200)

```json
{
  "success": true,
  "data": {
    "title": "File Title | Site",
    "description": "File description text",
    "thumbnail": "https://example.com/thumb.jpg",
    "author": "Author Name"
  }
}
```

### Errors

| Code | Condition |
|------|-----------|
| 400  | Missing `url` |
| 403  | Invalid/missing API secret |
| 500  | Browser crash or timeout |

---

## POST /api/download

Automate a full download flow: login → navigate → capture response → save file.

### Request

```json
{
  "url": "https://www.freepik.com/premium/vector/file",
  "siteSource": "Freepik",
  "providerConfig": {
    "email": "user@example.com",
    "password": "secret"
  }
}
```

`providerConfig` is optional – if omitted, no login step runs.

### Response (200)

```json
{
  "success": true,
  "data": {
    "downloadPath": "/downloads/Freepik_1234567890.zip",
    "fileName": "Freepik_1234567890.zip",
    "siteSource": "Freepik",
    "url": "https://www.freepik.com/..."
  }
}
```

### Errors

| Code | Condition |
|------|-----------|
| 400  | Missing `url` or `siteSource` |
| 403  | Invalid/missing API secret |
| 500  | Browser crash, login failure, download link not captured, or HTML error page downloaded |

---

## POST /api/test-provider

Identical to `/api/download` but runs the browser **visibly** (non-headless). Used during provider configuration to verify credentials.

### Request

Same as `/api/download`.

### Response

Same as `/api/download`.

---

## POST /api/test-custom-bot

Execute a user-defined sequence of browser steps (click, type, wait, etc.) and capture a download.

### Request

```json
{
  "url": "https://example.com/file",
  "steps": [
    {
      "action": "type",
      "selector": "#email",
      "useConfig": "email",
      "waitAfter": 500
    },
    {
      "action": "type",
      "selector": "#password",
      "useConfig": "password"
    },
    {
      "action": "click",
      "selector": "#login-btn",
      "waitAfter": 2000
    },
    {
      "action": "wait",
      "ms": 3000
    }
  ],
  "credentials": {
    "email": "user@example.com",
    "password": "secret"
  }
}
```

### Supported step actions

| Action | Fields |
|--------|--------|
| `goto` | `url`, `waitUntil`, `timeout` |
| `wait` | `selector` (waitForSelector) or `ms` (sleep) |
| `click` | `selector` |
| `type` / `fill` | `selector`, `useConfig` (`email`/`password`) or `text`, `delay` |
| `captureDownloadLink` | (no-op – download capturing is automatic) |

### Response (200)

```json
{
  "success": true,
  "data": {
    "downloadPath": "/downloads/Custom_1234567890.pdf",
    "fileName": "Custom_1234567890.pdf",
    "stepsExecuted": 4
  }
}
```

### Errors

| Code | Condition |
|------|-----------|
| 400  | Missing `url`, `steps`, or `credentials` |
| 403  | Invalid/missing API secret |
| 500  | No download link captured after steps, or download error |

---

## GET /health

Health-check endpoint (no auth required).

### Response (200)

```json
{
  "status": "ok, its up and running",
  "timestamp": "2026-05-25T12:00:00.000Z"
}
```
