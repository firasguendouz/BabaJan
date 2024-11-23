const express = require('express');
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// User Management
router.get('/users', verifyToken, verifyAdmin, adminController.getAllUsers); // Get all users
router.delete('/users/:userId', verifyToken, verifyAdmin, adminController.deleteUser); // Delete a user

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
