# Fix Plan — picksto-browser-service

## Issues found

### NODE-1 [HIGH] Dead utility file `executeStep.util.js` — ✅ DONE
- **Fix**: Removed dead file.

### NODE-2 [MEDIUM] `handleLogin` hardcoded to Freepik — ✅ DONE
- **Fix**: `handleLogin.util.js` now accepts custom `loginUrl` from credentials.

### NODE-3 [MEDIUM] No file cleanup mechanism — ✅ DONE
- **Fix**: Added `utils/cleanupDownloads.util.js` with 24h TTL (configurable via `CLEANUP_MAX_AGE_HOURS`). Runs on startup and every 6 hours via `setInterval`.

### NODE-4 [LOW] `asyncHandler.util.js` unused — ✅ DONE
- **Fix**: Removed dead file.

### NODE-5 [LOW] Dead npm dependencies — ✅ DONE
- **Fix**: Removed `ghost-cursor`, `fingerprint-generator`, `fingerprint-injector` from `package.json`.

### NODE-6 [LOW] Static User-Agent in downloadFile.util.js — ✅ DONE
- **Fix**: Uses rotating pool of 4 modern Chrome UAs. Overridable via `DOWNLOAD_USER_AGENT` env var.

### NODE-7 [LOW] No input validation beyond presence checks — ✅ DONE
- **Fix**: Added `utils/validateUrl.util.js`. All 4 actions now validate URL format. `testCustomBot` also validates that `steps` is a non-empty array.
