const express = require('express');
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const userController = require('../controllers/_userController');

const router = express.Router();

// Admin Login
router.post('/login', userController.loginAdmin);

// User Management (Admin Only)
router.get('/users', verifyToken, verifyAdmin, adminController.getAllUsers); // Get all users
router.delete('/users/:userId', verifyToken, verifyAdmin, adminController.deleteUser); // Delete a user
//router.patch('/users/:userId', verifyToken, verifyAdmin, adminController.updateUserProfile);

// Order Management (Admin Only)
router.get('/orders', verifyToken, verifyAdmin, adminController.getAllOrders); // Get all orders
router.patch('/orders/:orderId/status', verifyToken, verifyAdmin, adminController.updateOrderStatus); // Update order status

// Promotion Management (Admin Only)
router.get('/promotions', verifyToken, verifyAdmin, adminController.getAllPromotions); // Get all promotions
router.post('/promotions', verifyToken, verifyAdmin, adminController.createOrUpdatePromotion); // Create or update a promotion
router.delete('/promotions/:promoId', verifyToken, verifyAdmin, adminController.deletePromotion); // Soft delete a promotion

// Analytics
router.get('/analytics', verifyToken, verifyAdmin, adminController.getAnalytics); // Fetch analytics

module.exports = router;
