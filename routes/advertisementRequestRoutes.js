// routes/advertisementRequestRoutes.js
const express = require('express');
const router = express.Router();
const { submitAdRequest } = require('../controllers/advertisementRequestController');

// Public route - anyone can submit
router.post('/submit', submitAdRequest);

module.exports = router;