const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const extractPreviewAction = require('../actions/extractPreview.action');
const requestDownloadAction = require('../actions/requestDownload.action');
const testProviderAction = require('../actions/testProvider.action');
const testCustomBotAction = require('../actions/testCustomBot.action');

router.post('/extract-preview', authMiddleware, extractPreviewAction);
router.post('/download', authMiddleware, requestDownloadAction);
router.post('/test-provider', authMiddleware, testProviderAction);
router.post('/test-custom-bot', authMiddleware, testCustomBotAction);

module.exports = router;
