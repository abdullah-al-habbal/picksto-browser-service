// picksto-browser-service/src/handlers/downloadProcessing.handler.js
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
  const filePath = path.join(DOWNLOADS_DIR, tempName);

  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    method: 'GET',
    url: fileUrl,
    responseType: 'stream',
    timeout: 600000,
    maxRedirects: 10,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });

  response.data.pipe(writer);
  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  const buffer = fs.readFileSync(filePath);
  const detected = detectFileType(buffer);

  const preview = buffer.toString('utf8', 0, Math.min(500, buffer.length));
  if (preview.includes('<html') || preview.includes('<!DOCTYPE')) {
    fs.unlinkSync(filePath);
    throw new Error('Downloaded HTML error page instead of file');
  }

  const finalName = `${cleanName}_${timestamp}.${detected.ext}`;
  const finalPath = path.join(DOWNLOADS_DIR, finalName);
  fs.renameSync(filePath, finalPath);

  return finalPath;
};

const downloadProcessingHandler = async (url, siteSource, providerConfig = {}, options = {}) => {
  const { browser, page } = await launchBrowser({ headless: !options.visible });

  try {
    if (providerConfig.email && providerConfig.password) {
      await handleLogin(page, siteSource, providerConfig);
    }

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 3000));

    const downloadLink = await captureDownloadLink(page, url);
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

module.exports = { downloadProcessingHandler, downloadFile };
