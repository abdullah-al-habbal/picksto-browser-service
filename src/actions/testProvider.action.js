// picksto-browser-service\src\actions\testProvider.action.js
const { providerTestHandler } = require('../handlers/providerTest.handler');

const testProviderAction = async (req, res, next) => {
  try {
    const { url, siteSource, providerConfig } = req.body;
    if (!url || !siteSource || !providerConfig) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const result = await providerTestHandler(url, siteSource, providerConfig);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = testProviderAction;
