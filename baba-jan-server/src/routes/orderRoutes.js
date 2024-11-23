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
router.get('/admin', verifyToken, orderController.getAllOrders); // Get all orders (admin)
router.patch('/admin/status', verifyToken, orderController.updateOrderStatus); // Update order status (admin)

module.exports = router;
