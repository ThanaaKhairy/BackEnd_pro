const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ============== PUBLIC ROUTES (Anyone can access) ==============
router.get('/', countryController.getAllCountries);
router.get('/id', countryController.getCountryById);
router.get('/name', countryController.getCountryByName);

// ============== ADMIN ONLY ROUTES ==============
router.post('/',protect,authorize('Admin'),countryController.addCountry);

router.put('/', protect, authorize('Admin'), countryController.updateCountry);
router.delete('/', protect, authorize('Admin'), countryController.deleteCountry);
router.delete('/name', protect, authorize('Admin'), countryController.deleteCountryByName);
module.exports = router;