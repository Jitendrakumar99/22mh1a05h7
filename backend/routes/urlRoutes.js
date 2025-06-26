const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');


router.post('/shorturl', urlController.createShortUrl);
router.get('/:shortString', urlController.redirectToLongUrl);
router.get('/shorturl/:shortString', urlController.getShortUrlAnalytics);

module.exports = router; 