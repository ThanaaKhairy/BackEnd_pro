// const express = require('express');
// const router = express.Router();
// const advertisementController = require('../controllers/advertisementController');
// const { protect, authorize } = require('../middleware/authMiddleware');

// // ============== PUBLIC ROUTES (Anyone can access) ==============
// // Get all active ads
// router.get('/', advertisementController.getAllActiveAds);

// // Get single ad by ID
// router.get('/:id', advertisementController.getAdById);

// // Track ad click (redirect to link)
// router.get('/:id/click', advertisementController.trackAdClick);

// // ============== ADMIN ONLY ROUTES ==============
// // Apply admin middleware to all routes below
// router.use(protect);
// router.use(authorize('Admin'));

// // Get all ads 
// router.get('/admin/all', advertisementController.getAllAds);

// // Get active ads 
// router.get('/admin/active', advertisementController.getActiveAds);

// // Get inactive ads 
// router.get('/admin/inactive', advertisementController.getInactiveAds);

// // Get expired ads 
// router.get('/admin/expired', advertisementController.getExpiredAds);

// // Create new ad
// router.post('/admin', advertisementController.createAd);

// // Update ad
// router.put('/admin/:id', advertisementController.updateAd);

// // Toggle ad active/inactive status
// router.patch('/admin/:id/toggle', advertisementController.toggleAdStatus);

// // Delete ad
// router.delete('/admin/:id', advertisementController.deleteAd);

// module.exports = router;

const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ============== PUBLIC ROUTES ==============

// Get all active advertisements
router.get('/', advertisementController.getAllActiveAds);

// Get advertisement by id
router.get('/get-advertisement-by-id', advertisementController.getAdById);

// Track advertisement click
router.get('/click', advertisementController.trackAdClick);

// ============== ADMIN ROUTES ==============

router.use(protect);
router.use(authorize('Admin'));

// Get all advertisements
router.get('/admin/all', advertisementController.getAllAds);

// Get advertisements by status
router.get('/admin/active', advertisementController.getActiveAds);
router.get('/admin/inactive', advertisementController.getInactiveAds);
router.get('/admin/expired', advertisementController.getExpiredAds);

// Create advertisement
router.post('/admin/add-advertisement', advertisementController.createAd);

// Update advertisement
router.put('/admin/update-advertisement', advertisementController.updateAd);

// Toggle advertisement status
router.patch('/admin/toggle', advertisementController.toggleAdStatus);

// Delete advertisement
router.delete('/admin/delete-advertisement', advertisementController.deleteAd);

module.exports = router;