// picksto-browser-service\src\server.js
const { app, DOWNLOADS_DIR } = require('./app');
const cleanupDownloads = require('./utils/cleanupDownloads.util');

const PORT = process.env.PORT || 4000;

// Clean up old files on startup
const cleanupAgeHours = parseInt(process.env.CLEANUP_MAX_AGE_HOURS, 10) || 24;
cleanupDownloads(DOWNLOADS_DIR, cleanupAgeHours * 60 * 60 * 1000);

// Periodic cleanup every 6 hours
setInterval(() => {
  cleanupDownloads(DOWNLOADS_DIR, cleanupAgeHours * 60 * 60 * 1000);
}, 6 * 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🤖 Browser Service running on port ${PORT}`);
  console.log(`📁 Downloads directory: ${DOWNLOADS_DIR}`);
  console.log(`🔒 Headless mode: ${process.env.BROWSER_HEADLESS === 'true'}`);
  console.log(`🧹 Cleanup: files older than ${cleanupAgeHours}h removed every 6h`);
});
