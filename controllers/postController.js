const connectDB = require('../config/database');
const postService = require('../services/postService');
const {
  createPostSchema,
  updatePostSchema,
  commentSchema
} = require('../validators/postValidator');
const {
  validateRequiredFields,
  validateRequiredQuery,
  validateUpdateData,
  getErrorResponse
} = require('../utils/validationHelpers');

const Post = require('../models/Post');      
const User = require('../models/User'); 
// Helper function for validation
const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
};

// ============== PUBLIC APIs ==============

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const post = await postService.getPostById(id);
    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Get posts by user id
exports.getPostsByUser = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['userId']);
    
    const { userId } = req.query;
    const posts = await postService.getPostsByUser(userId);
    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// ============== USER APIs (require auth) ==============

// Create new post
exports.createPost = async (req, res) => {
  try {
    validateRequiredFields(req.body, ['title', 'content']);
    
    const validatedData = validate(createPostSchema, req.body);
    const post = await postService.createPost(validatedData, req.user.user_id);
    res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      post
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id']);
    validateUpdateData(req.body, ['title', 'content']);
    
    const { id } = req.query;
    const validatedData = validate(updatePostSchema, req.body);
    const post = await postService.updatePost(id, validatedData, req.user.user_id);
    res.status(200).json({
      success: true,
      message: 'Post updated successfully!',
      post
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Delete post (own post)
exports.deletePost = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const result = await postService.deletePost(id, req.user.user_id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Like a post
exports.likePost = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const result = await postService.likePost(id, req.user.user_id);
    res.status(200).json({
      success: true,
      message: result.message,
      likesCount: result.likesCount
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const result = await postService.unlikePost(id, req.user.user_id);
    res.status(200).json({
      success: true,
      message: result.message,
      likesCount: result.likesCount
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id']);
    validateRequiredFields(req.body, ['text']);
    
    const { id } = req.query;
    const { text } = validate(commentSchema, req.body);
    const result = await postService.addComment(id, req.user.user_id, text);
    res.status(201).json({
      success: true,
      message: result.message,
      comment: result.comment
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id', 'commentId']);
    
    const { id, commentId } = req.query;
    const result = await postService.deleteComment(id, commentId, req.user.user_id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'comment');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};

// ============== ADMIN APIs ==============

// Delete any post (Admin only)
exports.deleteAnyPost = async (req, res) => {
  try {
    validateRequiredQuery(req.query, ['id']);
    
    const { id } = req.query;
    const result = await postService.deleteAnyPost(id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    const { status, message, details } = getErrorResponse(error, 'Post');
    res.status(status).json({ error: message, ...(details && { details }) });
  }
};