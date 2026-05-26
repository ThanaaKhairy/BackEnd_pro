const User = require('../models/User');

// Fields allowed to return
const userFields = 'name email role';

// ✅ Get all users
const getAllUsers = async () => {
  const users = await User.find().select(userFields);
  return users;
};

// ✅ Get user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select(userFields);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// ✅ Promote user to admin
const promoteToAdmin = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'Admin') {
    throw new Error('User is already an admin');
  }

  user.role = 'Admin';
  await user.save();

  return {
    message: `User '${user.email}' promoted to admin successfully!`,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// ✅ Demote admin to user
const demoteToUser = async (email, requesterId) => {

  // Prevent demoting main admin
  if (
    email.toLowerCase() ===
    process.env.EMAIL_ADDRESS.toLowerCase()
  ) {
    throw new Error('Cannot demote the main admin account');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role !== 'Admin') {
    throw new Error('User is not an admin');
  }

  // Prevent self-demotion
  if (user._id.toString() === requesterId) {
    throw new Error('You cannot demote your own account');
  }

  user.role = 'user';
  await user.save();

  return {
    message: `Admin '${user.email}' demoted to regular user successfully!`,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

// ✅ Delete user by email
const deleteUserByEmail = async (email, requesterId) => {

  // Prevent deleting main admin
  if (
    email.toLowerCase() ===
    process.env.EMAIL_ADDRESS.toLowerCase()
  ) {
    throw new Error('Cannot delete the main admin account');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  // Prevent self deletion
  if (user._id.toString() === requesterId) {
    throw new Error('You cannot delete your own account');
  }

  // Must demote admin first
  if (user.role === 'Admin') {
    throw new Error(
      'Cannot delete an admin directly. Please demote to user first, then delete.'
    );
  }

  await User.findByIdAndDelete(user._id);

  return {
    message: `User '${user.email}' has been deleted successfully!`
  };
};

// ✅ Get all admins
const getAllAdmins = async () => {
  const admins = await User.find({
    role: 'Admin'
  }).select(userFields);

  return admins;
};

// ✅ Get all regular users
const getAllRegularUsers = async () => {
  const users = await User.find({
    role: 'user'
  }).select(userFields);

  return users;
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  promoteToAdmin,
  demoteToUser,
  deleteUserByEmail,
  getAllAdmins,
  getAllRegularUsers
};