const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// User Routes
router.post('/', verifyToken, orderController.placeOrder); // Place a new order
router.get('/', verifyToken, orderController.getUserOrders); // Get user-specific orders
router.get('/:orderId', verifyToken, orderController.getOrderDetails); // Get order details by ID
router.patch('/:orderId/cancel', verifyToken, orderController.cancelOrder); // Cancel an order

// Admin Routes
router.get('/admin/:orderId', verifyToken, orderController.getOrderDetails); // Fetch order details
router.patch('/admin/:orderId', verifyToken, orderController.updateOrderDetails); // Update order details

module.exports = router;
