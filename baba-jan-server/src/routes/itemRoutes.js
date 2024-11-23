const express = require('express');
const itemController = require('../controllers/itemController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Public Routes
router.get('/', itemController.getAllItems); // Get all items
router.get('/:itemId', itemController.getItemById); // Get item details by ID
router.get('/category/:category', itemController.getItemsByCategory); // Get items by category

// Admin Routes
router.post('/', verifyToken, verifyAdmin, itemController.createItem); // Create new item
router.put('/:itemId', verifyToken, verifyAdmin, itemController.updateItem); // Update item
router.delete('/:itemId', verifyToken, verifyAdmin, itemController.deleteItem); // Delete item
router.patch('/:itemId/availability', verifyToken, verifyAdmin, itemController.toggleItemAvailability); // Toggle item availability
router.patch('/bulk-stock', verifyToken, verifyAdmin, itemController.bulkUpdateStock); // Bulk update item stock

module.exports = router;
