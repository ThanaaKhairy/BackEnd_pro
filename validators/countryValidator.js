const { z } = require('zod');

// Country validation schema
const countrySchema = z.object({
  country_id: z.string()
    .min(1, 'ID is required')
    .regex(/^[a-z0-9-]+$/, 'ID must contain only lowercase letters, numbers, and hyphens'),
  
  country: z.string()
    .min(1, 'Country name is required')
    .min(2, 'Country name must be at least 2 characters')
    .max(50, 'Country name is too long'),
  
  countryCode: z.string()
    .min(1, 'Country code is required')
    .length(2, 'Country code must be exactly 2 characters')
    .regex(/^[A-Z]{2}$/, 'Country code must be uppercase letters only'),
  
  visaName: z.string()
    .min(1, 'Visa name is required'),
  
  visaType: z.enum(['Residence', 'Short-stay', 'Temporary residence', 'Long-term visa', 'Remote work permit']),
  
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  
  minIncomeMonthly: z.number()
    .positive('Monthly income must be positive'),
  
  minIncomeYearly: z.number()
    .positive('Yearly income must be positive'),
  
  currency: z.string()
    .min(1, 'Currency is required')
    .length(3, 'Currency code must be 3 characters (e.g., EUR, USD)'),
  
  currencySymbol: z.string()
    .min(1, 'Currency symbol is required'),
  
  durationMonths: z.number()
    .positive('Duration must be positive'),
  
  renewableYears: z.number()
    .min(0, 'Renewable years cannot be negative'),
  
  processingWeeks: z.number()
    .positive('Processing weeks must be positive'),
  
  costUSD: z.number()
    .positive('Cost must be positive'),
  
  costOfLivingIndex: z.number()
    .positive('Cost of living index must be positive'),
  
  color: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Color must be a valid hex code (e.g., #3b82f6)'),
  
  coordinates: z.object({
    lng: z.number(),
    lat: z.number()
  }),
  
  requirements: z.array(z.string())
    .min(1, 'At least one requirement is required'),
  
  benefits: z.array(z.string())
    .min(1, 'At least one benefit is required'),
  
  restrictions: z.array(z.string())
    .min(1, 'At least one restriction is required'),
  
  popular: z.boolean().optional().default(false),
  
  featured: z.boolean().optional().default(false),
  
  safetyRating: z.number()
    .min(0, 'Safety rating must be between 0 and 10')
    .max(10, 'Safety rating must be between 0 and 10'),
  
  internetSpeed: z.number()
    .min(0, 'Internet speed cannot be negative')
    .max(1000, 'Internet speed too high'),
  
  englishProficiency: z.enum(['Low', 'Low to Moderate', 'Moderate', 'High', 'Native']),
  
  timezone: z.string()
    .min(1, 'Timezone is required'),
  
  qualityOfLife: z.number()
    .min(0, 'Quality of life must be between 0 and 10')
    .max(10, 'Quality of life must be between 0 and 10'),
  
  bestFor: z.array(z.string())
    .min(1, 'At least one category in "best for" is required')
});

//  Update country schema 
const updateCountrySchema = countrySchema.partial();


module.exports = {
  countrySchema,
  updateCountrySchema,
};