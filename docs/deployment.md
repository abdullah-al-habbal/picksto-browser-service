# Picksto Browser Service — Deployment Guide

## Prerequisites

- Node.js 18+
- Chromium (bundled via Puppeteer, ~700MB)
- Shared secret matching Laravel's `BROWSER_SERVICE_SECRET`

## Environment Variables

```bash
# Required
PORT=4000
API_SECRET=<must match Laravel BROWSER_SERVICE_SECRET>

# Browser
BROWSER_HEADLESS=true

# Provider defaults (used by handleLogin)
PROVIDER_EMAIL=your_provider@email.com
PROVIDER_PASSWORD=your_provider_password

# File management
DOWNLOAD_DIR=./downloads
CLEANUP_MAX_AGE_HOURS=24

# Optional overrides
DOWNLOAD_USER_AGENT=                    # Override rotating UA pool
NODE_ENV=production                     # Suppresses stack traces
```

## Startup

```bash
npm ci --production
node src/server.js
```

The server checks on startup that `API_SECRET` is set and is not the default value. It will exit with a fatal error if missing.

## Process Management

The server handles SIGINT and SIGTERM for graceful shutdown:
1. Stops accepting new connections
2. Force-exits after 10 seconds if cleanup is pending

Recommended to run via a process manager (systemd, supervisor, PM2).

## Production Considerations

### Security
- Run behind a reverse proxy (nginx, Caddy) for TLS termination
- Restrict network access to the Laravel app's IP only
- The `--no-sandbox` Chromium flag is required in Docker/CI but should be mitigated with seccomp profiles

### Resource Management
- Each request spawns a full Chromium instance (~200MB RAM)
- Rate-limited to 20 requests per minute per IP
- Files older than `CLEANUP_MAX_AGE_HOURS` (default: 24h) are automatically deleted
- Cleanup runs at startup and every 6 hours thereafter

### Monitoring
- Health check: `GET /health` (public, no auth)
- Returns `{ status, timestamp }`
- Monitor disk usage in `DOWNLOAD_DIR`

### Logging
- Console output (JSON-compatible for log aggregators)
- Stack traces only shown when `NODE_ENV` is not `production`
- No correlation headers (consider adding `x-request-id` for tracing)

## Integration with Laravel

Both services must share the same secret:
- Laravel `.env`: `BROWSER_SERVICE_SECRET=<value>`
- Node `.env`: `API_SECRET=<same value>`

Laravel sends the secret via `X-API-Secret` header on every request to this service.
