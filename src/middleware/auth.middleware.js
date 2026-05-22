// picksto-browser-service\src\middleware\auth.middleware.js
const authMiddleware = (req, res, next) => {
  const secret = req.headers['x-api-secret'] || req.query.secret;
  if (!secret || secret !== process.env.API_SECRET) {
    return res.status(403).json({ success: false, message: 'Invalid or missing API secret' });
  }
  next();
};

module.exports = authMiddleware;
