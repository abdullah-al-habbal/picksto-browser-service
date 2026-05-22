// picksto-browser-service\src\handlers\previewExtraction.handler.js
const { launchBrowser, closeBrowser } = require('../utils/browserLauncher.util');

const previewExtractionHandler = async (url, siteSource = 'Unknown') => {
  const { browser, page } = await launchBrowser({ headless: true });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    const metadata = await page.evaluate(() => {
      const getMeta = (selector) => document.querySelector(selector)?.content?.trim() || null;
      const getTitle = () =>
        getMeta('meta[property="og:title"]') ||
        getMeta('meta[name="twitter:title"]') ||
        document.title;
      const getDesc = () =>
        getMeta('meta[property="og:description"]') || getMeta('meta[name="description"]') || '';
      const getImg = () =>
        getMeta('meta[property="og:image"]') || getMeta('meta[name="twitter:image"]');
      const getAuthor = () => {
        const schema = document.querySelector('script[type="application/ld+json"]');
        if (schema) {
          try {
            const data = JSON.parse(schema.textContent);
            if (data.author) return typeof data.author === 'string' ? data.author : data.author.name;
          } catch {}
        }
        return getMeta('meta[name="author"]') || getMeta('[itemprop="author"]');
      };

      return {
        title: getTitle() || 'Unknown Title',
        description: getDesc() || '',
        thumbnail: getImg() || null,
        author: getAuthor() || null
      };
    });

    return metadata;
  } finally {
    await closeBrowser(browser);
  }
};

module.exports = { previewExtractionHandler };
