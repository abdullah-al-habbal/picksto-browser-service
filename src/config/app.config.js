// picksto-browser-service/src/config/app.config.js
const path = require("path");

const config = {
  port: parseInt(process.env.PORT, 10) || 4000,
  apiSecret: process.env.API_SECRET,
  browserHeadless: process.env.BROWSER_HEADLESS !== "false",
  providerEmail: process.env.PROVIDER_EMAIL || "",
  providerPassword: process.env.PROVIDER_PASSWORD || "",
  downloadDir: path.resolve(
    __dirname,
    "../../",
    process.env.DOWNLOAD_DIR || "downloads",
  ),
};

module.exports = config;
