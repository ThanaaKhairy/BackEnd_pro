const { z } = require('zod');

//  Register validation schema
const registerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .regex(/^[A-Za-z ]+$/, 'Name must contain English letters only'),
  
  email: z.string()
    .email('Please enter a valid email')
    .regex(/@gmail\.com$/, 'Email must end with @gmail.com')
    .refine((email) => {
      const localPart = email.split('@')[0];
      // ممنوع يكون 8 أرقام أو أكثر قبل @
      const allDigitsRegex = /^\d{8,}$/;
      return !allDigitsRegex.test(localPart);
    }, 'Email username cannot be only numbers (8+ digits)')
    .refine((email) => {
      const localPart = email.split('@')[0];
      return localPart.length >= 6 && localPart.length <= 30;
    }, 'Email username must be between 6 and 30 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
});

//  Login validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required')
});

//  Email validation schema
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email')
});

//  Verify code schema
const verifyCodeSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  code: z.string().length(6, 'Code must be 6 digits')
});

//  Reset password schema
const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  new_password: z.string().min(8, 'Password must be at least 8 characters')
});

//  Verify reset code schema
const verifyResetCodeSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  reset_code: z.string().length(6, 'Reset code must be 6 digits')
});

module.exports = {
  registerSchema,
  loginSchema,
  emailSchema,
  verifyCodeSchema,
  resetPasswordSchema,
  verifyResetCodeSchema
};