// picksto-browser-service/src/utils/cleanupDownloads.util.js
const fs = require("fs");
const path = require("path");

const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

const cleanupDownloads = (downloadsDir, maxAgeMs = DEFAULT_MAX_AGE_MS) => {
  if (!fs.existsSync(downloadsDir)) return;

  const now = Date.now();
  let cleaned = 0;

  const entries = fs.readdirSync(downloadsDir);
  for (const entry of entries) {
    const fullPath = path.join(downloadsDir, entry);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isFile() && now - stat.mtimeMs > maxAgeMs) {
        fs.unlinkSync(fullPath);
        cleaned++;
      }
    } catch {
      // skip files we can't stat
    }
  }

  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} old file(s) from ${downloadsDir}`);
  }
};

module.exports = cleanupDownloads;
