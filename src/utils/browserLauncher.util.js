// picksto-browser-service/src/utils/browserLauncher.util.js
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const launchBrowser = async (options = {}) => {
  const browser = await puppeteer.launch({
    headless: options.headless !== false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  return { browser, page };
};

const closeBrowser = async (browser) => {
  if (browser) await browser.close();
};

module.exports = { launchBrowser, closeBrowser };
