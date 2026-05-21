const User = require('../models/User');
const generateVerificationCode = require('../utils/generateCode');
const { generateToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('./emailService');

//  Register user service
const registerUser = async (userData) => {
  const verificationCode = generateVerificationCode();
  const verificationCodeExpiry = new Date(Date.now() + 3 * 60 * 1000);

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    verification_code: verificationCode,
    verification_code_expiry: verificationCodeExpiry
  });

  // Send email (don't await to avoid blocking)
  await sendVerificationEmail(userData.email, verificationCode).catch(err => {
    console.error('Email sending failed:', err.message);
  });

  return { message: 'User registered successfully! Verification code sent to email.' };
};

//  Verify email service
const verifyEmail = async (email, code) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (Date.now() > new Date(user.verification_code_expiry).getTime()) {
    throw new Error('Verification code has expired');
  }

  if (code !== user.verification_code) {
    throw new Error('Invalid verification code');
  }

  user.is_verified = true;
  user.verification_code = null;
  user.verification_code_expiry = null;
  await user.save();

  return { message: 'Email verified successfully!' };
};

//  Login service
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  if (!user.is_verified) {
    throw new Error('Email not verified');
  }

const token = generateToken(user._id, user.email, user.name, user.role);

  return {
    message: 'Login successful!',
    token,
    user: {
      user_id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

//  Get profile service
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return { user };
};

//  Resend verification code service
const resendVerificationCode = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.is_verified) {
    throw new Error('Email is already verified');
  }

  const verificationCode = generateVerificationCode();
  const verificationCodeExpiry = new Date(Date.now() + 3 * 60 * 1000);

  user.verification_code = verificationCode;
  user.verification_code_expiry = verificationCodeExpiry;
  await user.save();

  await sendVerificationEmail(email, verificationCode).catch(err => {
    console.error('Email sending failed:', err.message);
  });

  return { message: 'Verification code resent successfully.' };
};

//  Forgot password service
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Email not found');
  }

  const resetCode = generateVerificationCode();
  const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.verification_code = resetCode;
  user.verification_code_expiry = resetCodeExpiry;
  await user.save();

  await sendVerificationEmail(email, resetCode).catch(err => {
    console.error('Email sending failed:', err.message);
  });

  return { message: 'Password reset code sent to email.' };
};

//  Verify reset code service
const verifyResetCode = async (email, resetCode) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (Date.now() > new Date(user.verification_code_expiry).getTime()) {
    throw new Error('Reset code has expired');
  }

  if (resetCode !== user.verification_code) {
    throw new Error('Invalid reset code');
  }

  return { message: 'Reset code verified successfully!' };
};

//  Reset password service
const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  user.password = newPassword;
  user.verification_code = null;
  user.verification_code_expiry = null;
  await user.save();

  return { message: 'Password reset successfully!' };
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  getProfile,
  resendVerificationCode,
  forgotPassword,
  verifyResetCode,
  resetPassword
};