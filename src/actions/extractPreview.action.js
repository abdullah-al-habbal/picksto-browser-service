// picksto-browser-service\src\actions\extractPreview.action.js
const { previewExtractionHandler } = require('../handlers/previewExtraction.handler');

const extractPreviewAction = async (req, res, next) => {
  try {
    const { url, siteSource } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    const metadata = await previewExtractionHandler(url, siteSource);
    res.json({ success: true, data: metadata });
  } catch (err) {
    next(err);
  }
};

module.exports = extractPreviewAction;
