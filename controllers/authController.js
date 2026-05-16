const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const generateVerificationCode = require('../utils/generateCode');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/database');
// Register
exports.register = async (req, res) => {

  try {
    await connectDB();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please fill all fields.' });
    }
    const usernameRegex = /^[A-Za-z]+$/;
    if (!usernameRegex.test(name)) {
      return res.status(400).json({
        error: "Username must contain English letters only"
      });
    }
    const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    const allDigitsRegex = /^\d{8,}@gmail\.com$/;

    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json({
        error: "Email must end with @gmail.com"
      });
    }


    if (allDigitsRegex.test(email)) {
      return res.status(400).json({
        error: "Email cannot be only numbers if it has 8 or more digits before @"
      });
    }


    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        error: "Email must be a valid Gmail address (e.g. name@gmail.com)"
      });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 3 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      verification_code: verificationCode,
      verification_code_expiry: verificationCodeExpiry
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: 'User registered successfully! Verification code sent to email.'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Verify Code
exports.verifyCode = async (req, res) => {
  try {
    await connectDB();
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (new Date() > user.verification_code_expiry) {
      return res.status(400).json({ error: 'Verification code has expired.' });
    }

    if (code !== user.verification_code) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    user.is_verified = true;
    user.verification_code = null;
    user.verification_code_expiry = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.is_verified) {
      return res.status(401).json({ error: 'Email not verified.' });
    }

    const token = jwt.sign(
      { user_id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        user_id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  await connectDB();
  res.status(200).json({ message: 'Logout successful.' });
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    await connectDB();
    const user = await User.findById(req.user.user_id).select('-password -refresh_token');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Resend verification code 
exports.resendVerificationCode = async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide an email.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }


    if (user.is_verified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 3 * 60 * 1000);

    user.verification_code = verificationCode;
    user.verification_code_expiry = verificationCodeExpiry;
    await user.save();

    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code resent successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password 
exports.forgotPassword = async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide an email.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Email not found.' });
    }

    const resetCode = generateVerificationCode();
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);


    user.verification_code = resetCode;
    user.verification_code_expiry = resetCodeExpiry;
    await user.save();

    await sendVerificationEmail(email, resetCode);

    res.status(200).json({ message: 'Password reset code sent to email.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Reset Code 
exports.verifyResetCode = async (req, res) => {
  try {
    await connectDB();
    const { email, reset_code } = req.body;

    if (!email || !reset_code) {
      return res.status(400).json({ error: 'Please provide email and reset code.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (new Date() > user.verification_code_expiry) {
      return res.status(400).json({ error: 'Reset code has expired.' });
    }

    if (reset_code !== user.verification_code) {
      return res.status(400).json({ error: 'Invalid reset code.' });
    }

    res.status(200).json({ message: 'Reset code verified successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password 
exports.resetPassword = async (req, res) => {
  try {
    await connectDB();
    const { email, new_password } = req.body;

    if (!email || !new_password) {
      return res.status(400).json({ error: 'Please provide email and new password.' });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.password = new_password;
    user.verification_code = null;
    user.verification_code_expiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};