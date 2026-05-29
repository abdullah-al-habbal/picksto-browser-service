// picksto-browser-service\src\middleware\auth.middleware.js
const crypto = require('crypto');

const authMiddleware = (req, res, next) => {
  const header = req.headers['x-api-secret'];
  if (!header || !process.env.API_SECRET) {
    return res.status(403).json({ success: false, message: 'Invalid or missing API secret' });
  }
  try {
    const expected = Buffer.from(process.env.API_SECRET);
    const actual = Buffer.from(header);
    if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) {
      return res.status(403).json({ success: false, message: 'Invalid or missing API secret' });
    }
  } catch {
    return res.status(403).json({ success: false, message: 'Invalid or missing API secret' });
  }
  next();
};

module.exports = authMiddleware;
