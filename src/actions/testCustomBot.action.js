// picksto-browser-service\src\actions\testCustomBot.action.js
const { customBotHandler } = require('../handlers/customBot.handler');

const testCustomBotAction = async (req, res, next) => {
  try {
    const { url, steps, credentials } = req.body;
    if (!url || !steps || !credentials) {
      return res.status(400).json({ success: false, message: 'URL, steps, and credentials are required' });
    }

    const result = await customBotHandler(url, steps, credentials, { visible: true });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = testCustomBotAction;
