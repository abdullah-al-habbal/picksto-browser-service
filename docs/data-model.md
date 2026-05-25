# Data Model — picksto-browser-service

The browser service is **stateless** with respect to databases. All data exists only ephemerally:

| Concept | Storage | Lifetime |
|---------|---------|----------|
| Browser session | In-memory (Puppeteer) | Per-request |
| Downloaded files | Local filesystem (`downloads/`) | Until manually cleaned |
| Configuration | Environment variables + `.env` | Process lifetime |

## File storage

- **Directory**: `downloads/` (relative to project root, configurable via `DOWNLOAD_DIR`).
- **Naming**: `{SiteSource}_{timestamp}.{ext}` (e.g. `Freepik_1712345678.zip`).
- **File-type detection**: Magic bytes checked against a signature map (jpg, png, gif, zip, rar, pdf, rtf, doc, mp3, mpg). Falls back to `.bin`.
- **Safety check**: Downloaded content is scanned for HTML tags – if the response looks like an HTML error page, the file is deleted and an error is thrown.

## Transient request data

Each incoming request carries:

```typescript
interface ExtractPreviewRequest {
  url: string;                      // Required
  siteSource?: string;              // Default "Unknown"
}

interface DownloadRequest {
  url: string;                      // Required
  siteSource: string;               // Required
  providerConfig?: {
    email?: string;
    password?: string;
    loginUrl?: string;              // Not read by browser service (ignored)
  };
}

interface CustomBotRequest {
  url: string;                      // Required
  steps: BotStep[];                 // Required
  credentials: {                    // Required
    email?: string;
    password?: string;
  };
}
```

## Configuration (environment)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Express listen port |
| `API_SECRET` | `change_this_in_production` | Shared secret for `X-API-Secret` auth |
| `BROWSER_HEADLESS` | `true` | Run Chromium headless (`false` = visible) |
| `PROVIDER_EMAIL` | `""` | Default provider login email |
| `PROVIDER_PASSWORD` | `""` | Default provider login password |
| `DOWNLOAD_DIR` | `./downloads` | Where downloaded files are saved |
