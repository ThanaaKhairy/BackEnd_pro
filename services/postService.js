// في postService.js
const User = require('../models/User');  
const Post = require('../models/Post'); 
// Get all posts (public)
const getAllPosts = async () => {
  const posts = await Post.find({ isActive: true })
    .populate('author', 'name email role')  
    .populate('comments.user', 'name email') 
    .sort({ createdAt: -1 });
  return posts;
};

// Get single post by ID
const getPostById = async (postId) => {
  const post = await Post.findById(postId)
    .populate('author', 'name email role')  
    .populate('comments.user', 'name email'); 
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  if (!post.isActive) {
    throw new Error('Post is not available');
  }
  
  return post;
};

// Get posts by user
const getPostsByUser = async (userId) => {
  const posts = await Post.find({ author: userId, isActive: true })
    .populate('author', 'name email role')  
    .sort({ createdAt: -1 });
  return posts;
};
// Create new post
const createPost = async (postData, userId) => {
  const post = await Post.create({
    title: postData.title,
    content: postData.content,
    author: userId
  });
  
  return post;
};

// Update post (only author can update)
const updatePost = async (postId, updateData, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  // Check if user is the author
  if (post.author._id.toString() !== userId) {
    throw new Error('You can only update your own posts');
  }
  
  if (updateData.title) post.title = updateData.title;
  if (updateData.content) post.content = updateData.content;
  
  await post.save();
  
  return post;
};

// Delete post (only author can delete)
const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  // Check if user is the author
  if (post.author._id.toString() !== userId) {
    throw new Error('You can only delete your own posts');
  }
  
  await Post.findByIdAndDelete(postId);
  
  return { message: 'Post deleted successfully' };
};

// Delete any post (Admin only)
const deleteAnyPost = async (postId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  await Post.findByIdAndDelete(postId);
  
  return { 
    message: `Post '${post.title}' has been deleted by admin successfully!`
  };
};

// Like a post
const likePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  // Check if user already liked
  if (post.likes.includes(userId)) {
    throw new Error('You already liked this post');
  }
  
  post.likes.push(userId);
  await post.save();
  
  return { 
    message: 'Post liked successfully',
    likesCount: post.likes.length
  };
};

// Unlike a post
const unlikePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  // Check if user has liked
  if (!post.likes.includes(userId)) {
    throw new Error('You have not liked this post');
  }
  
  post.likes = post.likes.filter(id => id.toString() !== userId);
  await post.save();
  
  return { 
    message: 'Post unliked successfully',
    likesCount: post.likes.length
  };
};

// Add comment
const addComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  post.comments.push({
    user: userId,
    text: text,
    createdAt: new Date()
  });
  
  await post.save();
  
  // Get the newly added comment
  const newComment = post.comments[post.comments.length - 1];
  
  return {
    message: 'Comment added successfully',
    comment: {
      id: newComment._id,
      text: newComment.text,
      createdAt: newComment.createdAt,
      user: newComment.user
    }
  };
};

// Delete comment (comment owner or post owner)
const deleteComment = async (postId, commentId, userId) => {
  const post = await Post.findById(postId);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  const comment = post.comments.id(commentId);
  
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  // Check if user is comment owner or post owner
  const isCommentOwner = comment.user._id.toString() === userId;
  const isPostOwner = post.author._id.toString() === userId;
  
  if (!isCommentOwner && !isPostOwner) {
    throw new Error('You can only delete your own comments');
  }
  
  comment.deleteOne();
  await post.save();
  
  return { message: 'Comment deleted successfully' };
};

module.exports = {
  getAllPosts,
  getPostById,
  getPostsByUser,
  createPost,
  updatePost,
  deletePost,
  deleteAnyPost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
};