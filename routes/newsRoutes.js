const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Public Routes
router.get('/all-news', newsController.getEverything);

module.exports = router;