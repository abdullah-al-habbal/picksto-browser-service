// picksto-browser-service\src\server.js
const { app, DOWNLOADS_DIR } = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🤖 Browser Service running on port ${PORT}`);
  console.log(`📁 Downloads directory: ${DOWNLOADS_DIR}`);
  console.log(`🔒 Headless mode: ${process.env.BROWSER_HEADLESS === 'true'}`);
});
