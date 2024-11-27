const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Create an order
router.post('/', verifyToken, orderController.createOrder);

// Get all orders (Admin only)
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);

// Get a specific order by ID
router.get('/:id', verifyToken, orderController.getOrderById);

// Update order status (Admin only)
router.patch('/:id/status', verifyToken, verifyAdmin, orderController.updateOrderStatus);

// Add an event to an order (Admin only)
router.post('/:id/events', verifyToken, verifyAdmin, orderController.addOrderEvent);

// Soft delete an order (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, orderController.deleteOrder);

// Restore a soft-deleted order (Admin only)
router.patch('/:id/restore', verifyToken, verifyAdmin, orderController.restoreOrder);

module.exports = router;
