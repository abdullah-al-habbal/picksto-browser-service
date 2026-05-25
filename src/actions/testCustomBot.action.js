// picksto-browser-service\src\actions\testCustomBot.action.js
const { customBotHandler } = require('../handlers/customBot.handler');
const validateUrl = require('../utils/validateUrl.util');

const testCustomBotAction = async (req, res, next) => {
  try {
    const { url, steps, credentials } = req.body;
    if (!url || !steps || !credentials) {
      return res.status(400).json({ success: false, message: 'URL, steps, and credentials are required' });
    }

    const validation = validateUrl(url);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ success: false, message: 'Steps must be a non-empty array' });
    }

    const result = await customBotHandler(url, steps, credentials, { visible: true });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = testCustomBotAction;
