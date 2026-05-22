// picksto-browser-service\src\handlers\customBot.handler.js
const { launchBrowser, closeBrowser } = require('../utils/browserLauncher.util');
const { downloadFile } = require('./downloadProcessing.handler');
const path = require('path');

const captureDownloadLink = (page) => {
  return new Promise(async (resolve) => {
    let found = null;
    page.on('response', (resp) => {
      const ct = resp.headers()['content-type'] || '';
      const cd = resp.headers()['content-disposition'] || '';
      const u = resp.url();
      if (
        ct.includes('application/') ||
        ct.includes('octet-stream') ||
        cd.includes('attachment') ||
        u.includes('.zip') ||
        u.includes('.rar')
      ) {
        found = u;
      }
    });
    await new Promise((r) => setTimeout(r, 5000));
    resolve(found);
  });
};

const executeStep = async (page, step, credentials) => {
  switch (step.action) {
    case 'goto':
      await page.goto(step.url.replace('{fileUrl}', step.urlPattern || ''), {
        waitUntil: step.waitUntil || 'domcontentloaded',
        timeout: step.timeout || 30000
      });
      break;
    case 'wait':
      if (step.selector) await page.waitForSelector(step.selector, { timeout: step.timeout || 10000 });
      else if (step.ms) await new Promise((r) => setTimeout(r, step.ms));
      break;
    case 'click':
      await page.waitForSelector(step.selector, { visible: true, timeout: 10000 });
      await page.click(step.selector);
      break;
    case 'type':
    case 'fill':
      await page.waitForSelector(step.selector, { visible: true });
      await page.click(step.selector, { clickCount: 3 });
      await page.keyboard.press('Backspace');
      const val =
        step.useConfig === 'email'
          ? credentials.email
          : step.useConfig === 'password'
          ? credentials.password
          : step.text;
      await page.keyboard.type(val, { delay: step.delay || 50 });
      break;
    case 'captureDownloadLink':
      break;
  }
  if (step.waitAfter) await new Promise((r) => setTimeout(r, step.waitAfter));
};

const customBotHandler = async (url, steps, credentials, options = {}) => {
  const { browser, page } = await launchBrowser({ headless: !options.visible });

  try {
    for (const step of steps) {
      await executeStep(page, step, credentials);
    }

    const downloadLink = await captureDownloadLink(page);
    if (!downloadLink) throw new Error('Custom steps did not yield a download link');

    const downloadPath = await downloadFile(downloadLink, 'Custom');

    return {
      downloadPath: `/downloads/${path.basename(downloadPath)}`,
      fileName: path.basename(downloadPath),
      stepsExecuted: steps.length
    };
  } finally {
    await closeBrowser(browser);
  }
};

module.exports = { customBotHandler };
