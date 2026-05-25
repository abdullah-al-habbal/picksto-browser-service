# Picksto Browser Service — Agent Guide

## Project

Headless browser automation microservice for the Picksto platform. Handles file download automation from third-party sites (e.g. Freepik) via Puppeteer, controlled by the Laravel backend.

## Key commands

```bash
npm start          # Production – node src/server.js
npm run dev        # Development – nodemon src/server.js
```

## Role relative to Laravel

The Laravel app (`picksto/`) sends HTTP requests to this service for:

| Endpoint | Laravel consumer |
|----------|------------------|
| `POST /api/extract-preview` | `DownloadRepository::extractPreview()` |
| `POST /api/download` | `DownloadRepository::requestDownload()` |
| `POST /api/test-provider` | `TestProviderRepository::testProvider()` |
| `POST /api/test-custom-bot` | `TestProviderRepository::testCustomBot()` |

## Auth

Shared secret via `X-API-Secret` header. Laravel references `config('services.browser.secret')` → `env('BROWSER_SERVICE_SECRET')`. The Node side checks against `API_SECRET` env var.

## Key files

| Path | Purpose |
|------|---------|
| `src/server.js` | Entry point |
| `src/app.js` | Express config + `/health` |
| `src/routes/api.routes.js` | Route definitions |
| `src/actions/*` | Request handlers |
| `src/handlers/*` | Puppeteer automation logic |
| `src/utils/` | Shared utilities |
| `docs/` | Architecture, API specs, data model |

## Env vars required

```
PORT=4000
API_SECRET=<match Laravel BROWSER_SERVICE_SECRET>
BROWSER_HEADLESS=true
PROVIDER_EMAIL=
PROVIDER_PASSWORD=
DOWNLOAD_DIR=./downloads
```

## Design constraints

- Stateless – no database, no queue.
- Files accumulate in `downloads/` – manual cleanup required.
- Only Freepik login is automated; other providers need custom-bot steps.
