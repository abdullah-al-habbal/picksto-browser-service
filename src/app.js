// picksto-browser-service\src\app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/api.routes');
const { errorHandler } = require('./utils/errorHandler.util');

const app = express();
const DOWNLOADS_DIR = path.resolve(__dirname, '..', process.env.DOWNLOAD_DIR || 'downloads');

if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Rate limiting: browser-heavy endpoints capped to prevent resource exhaustion
const browserLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later' },
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', browserLimiter, apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok, its up and running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

module.exports = { app, DOWNLOADS_DIR };
