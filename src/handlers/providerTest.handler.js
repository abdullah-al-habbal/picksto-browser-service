// picksto-browser-service\src\handlers\providerTest.handler.js
const { downloadProcessingHandler } = require("./downloadProcessing.handler");

const providerTestHandler = async (url, siteSource, providerConfig) => {
  return await downloadProcessingHandler(url, siteSource, providerConfig, {
    visible: true,
  });
};

module.exports = { providerTestHandler };
