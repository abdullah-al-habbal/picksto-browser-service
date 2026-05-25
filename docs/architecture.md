# Architecture — picksto-browser-service

## Overview

A headless-browser microservice built on **Express.js** + **Puppeteer** that automates file downloads from third-party provider sites (e.g. Freepik). It acts as a robotic bridge between the Picksto Laravel application and external content providers.

## Stack

| Layer         | Technology                                         |
|---------------|----------------------------------------------------|
| Runtime       | Node.js (≥18)                                      |
| Framework     | Express 4                                          |
| Browser       | Puppeteer 22 + puppeteer-extra + stealth-plugin    |
| Auth          | Shared API secret (`X-API-Secret` header)          |
| HTTP          | axios (for downstream file download)               |
| Security      | helmet, cors                                       |

## Directory layout

```
src/
├── server.js                     # Entry point – starts Express on PORT
├── app.js                        # Express app setup, middleware, /health
├── config/
│   └── app.config.js             # Env-based configuration object
├── routes/
│   └── api.routes.js             # POST /extract-preview, /download, /test-provider, /test-custom-bot
├── middleware/
│   └── auth.middleware.js        # Validates x-api-secret header
├── actions/                      # Thin Express route handlers → delegate to handlers
│   ├── extractPreview.action.js
│   ├── requestDownload.action.js
│   ├── testProvider.action.js
│   └── testCustomBot.action.js
├── handlers/                     # Business logic (Puppeteer automation)
│   ├── previewExtraction.handler.js
│   ├── downloadProcessing.handler.js
│   ├── providerTest.handler.js
│   └── customBot.handler.js
└── utils/                        # Shared utilities
    ├── browserLauncher.util.js
    ├── captureDownloadLink.util.js
    ├── downloadFile.util.js
    ├── executeStep.util.js
    ├── fileTypeDetector.util.js
    ├── handleLogin.util.js
    ├── asyncHandler.util.js       # (unused in actions – actions use try/catch)
    └── errorHandler.util.js
```

## Request flow

```
Laravel (HTTP client)
    │  POST /api/download  (X-API-Secret)
    ▼
Express route → authMiddleware → action → handler
    │
    ├── 1. Launch headless Chromium (puppeteer-extra + stealth)
    ├── 2. Optionally log in to provider site
    ├── 3. Navigate to target URL
    ├── 4. Wait for network idle
    ├── 5. Capture download link (intercept network response)
    ├── 6. Download file via axios (local filesystem)
    └── 7. Return file path / metadata
```

## Security

- Every endpoint (except `/health`) requires the `X-API-Secret` header.
- The secret is compared against `API_SECRET` env var.
- The header can also be passed as `?secret=` query parameter (fallback).
- Helmet adds standard HTTP security headers.
- CORS is wide open (`cors()` with no options) – acceptable since this is an internal microservice.

## Known issues

1. **executeStep.util.js is duplicated** – the same step-execution logic exists in both `utils/executeStep.util.js` and inline in `handlers/customBot.handler.js`. The utility file is never imported.
2. **handleLogin util is Freepik-specific** – hardcoded to `freepik.com/login`; will silently skip any other provider.
3. **No file cleanup** – downloaded files accumulate in `downloads/` indefinitely.
4. **Static `User-Agent`** – downloadFile.util.js uses a hardcoded Windows Chrome UA string.
5. **Timeout on download is high** – 600 seconds (10 min) for file download via axios.
