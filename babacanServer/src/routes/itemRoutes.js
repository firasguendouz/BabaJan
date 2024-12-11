const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Add a product (Admin only)
router.post('/:categoryId/:subcategoryId', verifyToken, verifyAdmin, itemController.addProduct);
router.get('/',   itemController.getAllProducts);

// Manage a product by ID
router.get('/:categoryId/:subcategoryId/:productId', verifyToken, itemController.getProductById);
router.patch('/:categoryId/:subcategoryId/:productId', verifyToken, verifyAdmin, itemController.updateProduct);
router.delete('/:categoryId/:subcategoryId/:productId', verifyToken, verifyAdmin, itemController.deleteProduct);

module.exports = router;
