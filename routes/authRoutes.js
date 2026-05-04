const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/verify-code', authController.verifyCode);
router.post('/resend-verification-code', authController.resendVerificationCode);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);
router.post('/login', authController.login);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/profile', protect, authController.getProfile);

// Admin only routes
router.get('/admin/users', protect, authorize('Admin'), (req, res) => {
  // مثال: جلب كل المستخدمين
});

module.exports = router;