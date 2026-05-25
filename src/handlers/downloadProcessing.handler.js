const path = require('path');
const { launchBrowser, closeBrowser } = require('../utils/browserLauncher.util');
const handleLogin = require('../utils/handleLogin.util');
const captureDownloadLink = require('../utils/captureDownloadLink.util');
const downloadFile = require('../utils/downloadFile.util');

const downloadProcessingHandler = async (url, siteSource, providerConfig = {}, options = {}) => {
  const { browser, page } = await launchBrowser({ headless: !options.visible });

  try {
    if (providerConfig.email && providerConfig.password) {
      await handleLogin(page, siteSource, providerConfig);
    }

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 3000));

    const downloadLink = await captureDownloadLink(page);
    if (!downloadLink) {
      throw new Error('Failed to capture download link');
    }

    const downloadPath = await downloadFile(downloadLink, siteSource);

    return {
      downloadPath: `/downloads/${path.basename(downloadPath)}`,
      fileName: path.basename(downloadPath),
      siteSource,
      url
    };
  } finally {
    await closeBrowser(browser);
  }
};

module.exports = { downloadProcessingHandler };