const { z } = require('zod');

// Create post validation
const createPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string()
    .min(1, 'Content is required')
});

// Update post validation
const updatePostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .optional(),
  content: z.string()
    .min(1, 'Content is required')
    .optional()
});

// Comment validation
const commentSchema = z.object({
  text: z.string()
    .min(1, 'Comment text is required')
    .max(500, 'Comment cannot exceed 500 characters')
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  commentSchema
};