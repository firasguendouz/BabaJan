const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// User Routes
router.post('/register', userController.registerUser); // Register a new user
router.post('/login', userController.loginUser); // User login
router.get('/profile', verifyToken, userController.getUserProfile); // Get user profile
router.patch('/profile', verifyToken, userController.updateUserProfile); // Update user profile

// Password Management
router.post('/forgot-password', userController.forgotPassword); // Initiate password reset
router.post('/reset-password', userController.resetPassword); // Reset password

// Admin Routes
router.get('/admin', verifyToken, userController.getAllUsers); // Get all users (admin)

module.exports = router;
