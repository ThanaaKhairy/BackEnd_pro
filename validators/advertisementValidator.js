const { z } = require('zod');

const normalizeDate = (date) => {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));
};

const adBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  companyName: z.string().min(1, 'Company name is required'),
  linkUrl: z.string().url('Invalid URL format'),

  startDate: z.coerce.date({
    invalid_type_error: 'Invalid start date'
  }),

  endDate: z.coerce.date({
    invalid_type_error: 'Invalid end date'
  }),

  position: z.number().int().min(0).optional()
});


//  CREATE AD SCHEMA
 
const createAdSchema = adBaseSchema
  .refine((data) => {
    const today = normalizeDate(new Date());
    const start = normalizeDate(data.startDate);

    return start >= today;
  }, {
    message: 'Start date cannot be in the past',
    path: ['startDate']
  })
  .refine((data) => {
    const start = normalizeDate(data.startDate);
    const end = normalizeDate(data.endDate);

    return start < end;
  }, {
    message: 'Start date must be before end date',
    path: ['endDate']
  });

//  UPDATE AD SCHEMA

const updateAdSchema = adBaseSchema
  .partial()
  .superRefine((data, ctx) => {
    const today = normalizeDate(new Date());

    if (data.startDate) {
      const start = normalizeDate(data.startDate);

      if (start < today) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['startDate'],
          message: 'Start date cannot be in the past'
        });
      }
    }

    if (data.startDate && data.endDate) {
      const start = normalizeDate(data.startDate);
      const end = normalizeDate(data.endDate);

      if (start >= end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: 'Start date must be before end date'
        });
      }
    }
  });

module.exports = {
  createAdSchema,
  updateAdSchema
};