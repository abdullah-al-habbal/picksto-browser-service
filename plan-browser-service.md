# Fix Plan — picksto-browser-service

## Issues found

### NODE-1 [HIGH] Dead utility file `executeStep.util.js`
- **Issue**: `src/utils/executeStep.util.js` contains step execution logic identical to the inline code in `src/handlers/customBot.handler.js`, but it's never imported anywhere.
- **Fix**: Remove the dead file, or refactor `customBot.handler.js` to import from it instead of duplicating.

### NODE-2 [MEDIUM] `handleLogin` hardcoded to Freepik
- **Issue**: `src/utils/handleLogin.util.js` only handles `freepik.com/login`. `loginUrl` from provider config is silently ignored.
- **Fix**: Accept `loginUrl` from credentials and navigate there instead of hardcoding.

### NODE-3 [MEDIUM] No file cleanup mechanism
- **Issue**: Downloaded files accumulate in `downloads/` indefinitely with no TTL or cleanup job.
- **Fix**: Add a simple cleanup routine (e.g., delete files older than 24h on startup or periodically).

### NODE-4 [LOW] `asyncHandler.util.js` is defined but unused
- **Issue**: `src/utils/asyncHandler.util.js` wraps async route handlers but the actions use try/catch instead.
- **Fix**: Either remove it or refactor actions to use it.

### NODE-5 [LOW] Dead npm dependencies
- **Issue**: `ghost-cursor`, `fingerprint-generator`, `fingerprint-injector` are installed in `package.json` but never imported.
- **Fix**: Remove unused dependencies.

### NODE-6 [INFO] Static User-Agent in downloadFile.util.js
- **Issue**: Hardcoded `User-Agent` header in `src/utils/downloadFile.util.js:24`.
- **Fix**: Accept user-agent via config or rotate from a pool.

### NODE-7 [LOW] No input validation beyond presence checks
- **Issue**: Actions only check if fields are present (`!url`, `!siteSource`), no format validation.
- **Fix**: Add basic validation for URL format.

## Applied fixes

| # | Status | Details |
|---|--------|---------|
| NODE-1 | Done | Removed `src/utils/executeStep.util.js` |
| NODE-2 | Done | `handleLogin.util.js` now accepts custom `loginUrl` from credentials |
| NODE-4 | Done | Removed unused `asyncHandler.util.js` |
| NODE-5 | Done | Removed unused deps from `package.json` |

## Verifying the fixes

```bash
node -e "require('./src/app')"   # Should start without errors
npm test                          # Run tests (none exist yet)
```
