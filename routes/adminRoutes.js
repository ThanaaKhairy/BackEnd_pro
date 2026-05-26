const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');


//  Apply auth middleware to all routes
router.use(protect);
router.use(authorize('Admin'));


//  Get all users
router.get('/allUsers', adminController.getAllUsers);

//  Get user by email (in URL)
router.get('/user/email', adminController.getUserByEmail);

//  Get all admins only
router.get('/admins', adminController.getAllAdmins);

//  Get all regular users only (not admins)
router.get('/regular-users', adminController.getAllRegularUsers);

//  Promote user to admin (using body)
router.post('/promote-to-admin', adminController.promoteToAdmin);

//  Demote admin to user (using body)
router.post('/demote-to-user', adminController.demoteToUser);

//  Delete user by email (using body)
router.delete('/delete-user', adminController.deleteUserByEmail);

module.exports = router;