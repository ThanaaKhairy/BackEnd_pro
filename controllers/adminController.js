const adminService = require('../services/adminService');

// Email validation
const validateEmail = (email) => {

  if (!email) {
    throw new Error('Email is required');
  }

  if (typeof email !== 'string') {
    throw new Error('Please provide a valid email address');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Please enter a valid email');
  }

  // Gmail only
  if (!/@gmail\.com$/.test(normalizedEmail)) {
    throw new Error('Email must end with @gmail.com');
  }

  const localPart = normalizedEmail.split('@')[0];

  // Prevent numeric username only
  if (/^\d{8,}$/.test(localPart)) {
    throw new Error(
      'Email username cannot be only numbers (8+ digits)'
    );
  }

  // Username length
  if (
    localPart.length < 6 ||
    localPart.length > 30
  ) {
    throw new Error(
      'Email username must be between 6 and 30 characters'
    );
  }

  return normalizedEmail;
};

//  Get all users
exports.getAllUsers = async (req, res) => {
  try {

    const users =
      await adminService.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

//  Get user by email
exports.getUserByEmail = async (
  req,
  res
) => {
  try {

    const { email } = req.query;

    const validatedEmail =
      validateEmail(email);

    const user =
      await adminService.getUserByEmail(
        validatedEmail
      );

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    if (
      error.message ===
      'User not found'
    ) {
      return res.status(404).json({
        error: error.message
      });
    }

    res.status(400).json({
      error: error.message
    });
  }
};

//  Promote user to admin
exports.promoteToAdmin =
  async (req, res) => {
    try {

      const { email } = req.body;

      const validatedEmail =
        validateEmail(email);

      const result =
        await adminService
          .promoteToAdmin(
            validatedEmail
          );

      res.status(200).json(result);

    } catch (error) {

      if (
        error.message ===
        'User not found'
      ) {
        return res.status(404).json({
          error: error.message
        });
      }

      if (
        error.message ===
        'User is already an admin'
      ) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: error.message
      });
    }
  };

//  Demote admin to user
exports.demoteToUser =
  async (req, res) => {
    try {

      const { email } = req.body;

      const validatedEmail =
        validateEmail(email);

      const result =
        await adminService
          .demoteToUser(
            validatedEmail,
            req.user.user_id
          );

      res.status(200).json(result);

    } catch (error) {

      const knownErrors = [
        'User not found',
        'User is not an admin',
        'You cannot demote your own account',
        'Cannot demote the main admin account'
      ];

      if (
        knownErrors.includes(
          error.message
        )
      ) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: error.message
      });
    }
  };

// Delete user
exports.deleteUserByEmail =
  async (req, res) => {
    try {

      const { email } = req.body;

      const validatedEmail =
        validateEmail(email);

      const result =
        await adminService
          .deleteUserByEmail(
            validatedEmail,
            req.user.user_id
          );

      res.status(200).json(result);

    } catch (error) {

      const knownErrors = [
        'User not found',
        'You cannot delete your own account',
        'Cannot delete the main admin account',
        'Cannot delete an admin directly. Please demote to user first, then delete.'
      ];

      if (
        knownErrors.includes(
          error.message
        )
      ) {
        return res.status(400).json({
          error: error.message
        });
      }

      res.status(500).json({
        error: error.message
      });
    }
  };

//  Get all admins
exports.getAllAdmins =
  async (req, res) => {
    try {

      const admins =
        await adminService
          .getAllAdmins();

      res.status(200).json({
        success: true,
        count: admins.length,
        admins
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  };

//  Get all regular users
exports.getAllRegularUsers =
  async (req, res) => {
    try {

      const users =
        await adminService
          .getAllRegularUsers();

      res.status(200).json({
        success: true,
        count: users.length,
        users
      });

    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  };