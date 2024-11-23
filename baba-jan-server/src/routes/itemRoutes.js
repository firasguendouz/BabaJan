const express = require('express');
const itemController = require('../controllers/itemController');
const { verifyToken, verifyAdmin } = require('../middleware/auth'); // Authentication middlewares

const router = express.Router();

// Create a new item (Admin only)
router.post('/', verifyToken, verifyAdmin, itemController.createItem);

// Get all items (Public)
router.get('/', itemController.getAllItems);

// Get a single item by ID (Public)
router.get('/:id', itemController.getItemById);

// Update an item (Admin only)
router.put('/:id', verifyToken, verifyAdmin, itemController.updateItem);

// Soft delete an item (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, itemController.deleteItem);

// Restore a soft-deleted item (Admin only)
router.patch('/:id/restore', verifyToken, verifyAdmin, itemController.restoreItem);

module.exports = router;
