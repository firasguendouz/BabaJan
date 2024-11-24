const express = require('express');
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();
// Admin Registration (Super Admin only)
router.post('/register', verifyToken, verifyAdmin, userController.registerAdmin);

// Admin Login
router.post('/login', userController.loginAdmin);

// User Management
router.get('/users', verifyToken, verifyAdmin, adminController.getAllUsers); // Get all users
router.delete('/users/:userId', verifyToken, verifyAdmin, adminController.deleteUser); // Delete a user
router.patch('/users/:userId', verifyToken, verifyAdmin, userController.updateUserProfile);

// Order Management
router.get('/orders', verifyToken, verifyAdmin, adminController.getAllOrders); // Get all orders
router.patch('/orders/status', verifyToken, verifyAdmin, adminController.updateOrderStatus); // Update order status

// Item Management
router.post('/items', verifyToken, verifyAdmin, adminController.createItem); // Create an item
router.put('/items/:itemId', verifyToken, verifyAdmin, adminController.updateItem); // Update an item
router.delete('/items/:itemId', verifyToken, verifyAdmin, adminController.deleteItem); // Delete an item

// Promotion Management
router.get('/promotions', verifyToken, verifyAdmin, adminController.getAllPromotions); // Get all promotions
router.post('/promotions', verifyToken, verifyAdmin, adminController.createOrUpdatePromotion); // Create/update a promotion
router.delete('/promotions/:promoId', verifyToken, verifyAdmin, adminController.deletePromotion); // Delete a promotion

// Analytics
router.get('/analytics', verifyToken, verifyAdmin, adminController.getAnalytics); // Fetch analytics

module.exports = router;
