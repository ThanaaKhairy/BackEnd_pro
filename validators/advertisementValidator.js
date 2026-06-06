const { z } = require('zod');

// Base schema without refine
const adBaseSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot exceed 500 characters'),
  companyName: z.string()
    .min(1, 'Company name is required'),
  linkUrl: z.string()
    .url('Please enter a valid URL')
    .min(1, 'Link URL is required'),
  startDate: z.date().or(z.string().datetime().transform(val => new Date(val))),
  endDate: z.date().or(z.string().datetime().transform(val => new Date(val))),
  position: z.number().int().min(0).optional()
});

// Create ad schema with refine
const createAdSchema = adBaseSchema.refine((data) => {
  return data.startDate < data.endDate;
}, {
  message: 'Start date must be before end date',
  path: ['startDate']
});

// Update ad schema - using partial() on the base schema WITHOUT refine
const updateAdSchema = adBaseSchema.partial();

module.exports = {
  createAdSchema,
  updateAdSchema
};