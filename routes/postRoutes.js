const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ============== PUBLIC ROUTES ==============
router.get('/', postController.getAllPosts);
router.get('/get-post-by-id', postController.getPostById);
router.get('/user-posts', postController.getPostsByUser);

// ============== PROTECTED ROUTES ==============

// Create post
router.post('/add-post', protect, postController.createPost);

// Update post
router.put('/Update-post', protect, postController.updatePost);

// Delete post
router.delete('/delete-post', protect, postController.deletePost);

// Like / Unlike
router.post('/add-like', protect, postController.likePost);
router.delete('/delete-like', protect, postController.unlikePost);

// Comments
router.post('/add-comment', protect, postController.addComment);
router.delete('/delete-comment', protect, postController.deleteComment);

// ============== ADMIN ONLY ROUTES ==============
router.delete('/admin/delete-post', protect, authorize('Admin'), postController.deleteAnyPost);

module.exports = router;