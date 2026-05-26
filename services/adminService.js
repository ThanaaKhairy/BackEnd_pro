const User = require('../models/User');

//  Get all users
const getAllUsers = async () => {
  const users = await User.find().select('-password');
  return users;
};

//  Get user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email }).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

//  Promote user to admin
const promoteToAdmin = async (email, requesterId) => {
  // Find the user
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if user is already an admin
  if (user.role === 'Admin') {
    throw new Error('User is already an admin');
  }
  
  // Update role to Admin
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

//  Demote admin to user
const demoteToUser = async (email, requesterId) => {
  // Find the user
    if (email.toLowerCase() === process.env.EMAIL_ADDRESS) {
    throw new Error('Cannot demote the main admin account');
  }
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if user is actually an admin
  if (user.role !== 'Admin') {
    throw new Error('User is not an admin');
  }
  
  // Prevent self-demotion (cannot demote your own account)
  if (user._id.toString() === requesterId) {
    throw new Error('You cannot demote your own account');
  }
  
  // Update role to user
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

//  Delete user by email
const deleteUserByEmail = async (email, requesterId) => {
  // Find the user
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Prevent self-deletion
  if (user._id.toString() === requesterId) {
    throw new Error('You cannot delete your own account');
  }
  
  // Cannot delete an admin directly (must demote to user first)
  if (user.role === 'Admin') {
    throw new Error('Cannot delete an admin directly. Please demote to user first, then delete.');
  }
  
  // Delete user from database
  await User.findByIdAndDelete(user._id);
  
  return { 
    message: `User '${user.email}' has been deleted successfully!`
  };
};

//  Get all admins
const getAllAdmins = async () => {
  const admins = await User.find({ role: 'Admin' }).select('-password');
  return admins;
};

//  Get all regular users (not admins)
const getAllRegularUsers = async () => {
  const users = await User.find({ role: 'user' }).select('-password');
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