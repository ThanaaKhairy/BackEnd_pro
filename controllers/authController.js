
const authService = require('../services/authService');
const {
  registerSchema,
  loginSchema,
  emailSchema,
  verifyCodeSchema,
  resetPasswordSchema,
  verifyResetCodeSchema
} = require('../validators/authValidator');

// Helper function for validation
const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const error =  result.error?.issues?.[0]?.message || 'Validation failed';
    throw new Error(error);
  }
  return result.data;
};

// Register
exports.register = async (req, res) => {
  try {
    const validatedData = validate(registerSchema, req.body);
    const result = await authService.registerUser(validatedData);
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(400).json({ error: error.message });
  }
};

// Verify Code
exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = validate(verifyCodeSchema, req.body);
    const result = await authService.verifyEmail(email, code);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = validate(loginSchema, req.body);
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logout successful.' });
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const result = await authService.getProfile(req.user.user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Resend verification code
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = validate(emailSchema, req.body);
    const result = await authService.resendVerificationCode(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = validate(emailSchema, req.body);
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Verify Reset Code
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, reset_code } = validate(verifyResetCodeSchema, req.body);
    const result = await authService.verifyResetCode(email, reset_code);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, new_password } = validate(resetPasswordSchema, req.body);
    const result = await authService.resetPassword(email, new_password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};