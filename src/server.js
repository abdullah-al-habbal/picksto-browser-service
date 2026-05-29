// picksto-browser-service\src\server.js
const { app, DOWNLOADS_DIR } = require('./app');
const cleanupDownloads = require('./utils/cleanupDownloads.util');

const PORT = process.env.PORT || 4000;

// Refuse to start without a proper API secret
if (!process.env.API_SECRET || process.env.API_SECRET === 'change_this_in_production') {
  console.error('FATAL: API_SECRET environment variable must be set to a secure value');
  process.exit(1);
}

// Clean up old files on startup
const cleanupAgeHours = parseInt(process.env.CLEANUP_MAX_AGE_HOURS, 10) || 24;
cleanupDownloads(DOWNLOADS_DIR, cleanupAgeHours * 60 * 60 * 1000);

// Periodic cleanup every 6 hours
setInterval(() => {
  cleanupDownloads(DOWNLOADS_DIR, cleanupAgeHours * 60 * 60 * 1000);
}, 6 * 60 * 60 * 1000);

const server = app.listen(PORT, () => {
  console.log(`🤖 Browser Service running on port ${PORT}`);
  console.log(`📁 Downloads directory: ${DOWNLOADS_DIR}`);
  console.log(`🔒 Headless mode: ${process.env.BROWSER_HEADLESS === 'true'}`);
  console.log(`🧹 Cleanup: files older than ${cleanupAgeHours}h removed every 6h`);
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
