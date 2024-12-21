/**
 * Index file to export all user controllers.
 * 
 * Import each controller function from individual files 
 * and export them as named properties for easy import elsewhere in the app.
 */

const registerAdmin = require('./registerAdmin');
const loginAdmin = require('./loginAdmin');
const registerUser = require('./registerUser');
const loginUser = require('./loginUser');
const getUserProfile = require('./getUserProfile');
const updateUserProfile = require('./updateUserProfile');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');
const getAllUsers = require('./getAllUsers');

module.exports = {
  registerAdmin,
  loginAdmin,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
};
