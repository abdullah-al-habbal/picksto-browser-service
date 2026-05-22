// picksto-browser-service\src\actions\requestDownload.action.js
const { downloadProcessingHandler } = require('../handlers/downloadProcessing.handler');

const requestDownloadAction = async (req, res, next) => {
  try {
    const { url, siteSource, providerConfig } = req.body;
    if (!url || !siteSource) {
      return res.status(400).json({ success: false, message: 'URL and siteSource are required' });
    }

    const result = await downloadProcessingHandler(url, siteSource, providerConfig);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = requestDownloadAction;
