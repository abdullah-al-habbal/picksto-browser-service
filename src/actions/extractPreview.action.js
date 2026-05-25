// picksto-browser-service\src\actions\extractPreview.action.js
const { previewExtractionHandler } = require('../handlers/previewExtraction.handler');
const validateUrl = require('../utils/validateUrl.util');

const extractPreviewAction = async (req, res, next) => {
  try {
    const { url, siteSource } = req.body;

    const validation = validateUrl(url);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const metadata = await previewExtractionHandler(url, siteSource);
    res.json({ success: true, data: metadata });
  } catch (err) {
    next(err);
  }
};

module.exports = extractPreviewAction;
