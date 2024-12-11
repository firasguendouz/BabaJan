const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Create, Read, Update, Delete Categories (Admin only)
router.post('/', verifyToken, verifyAdmin, categoryController.createCategory);
router.get('/',  categoryController.getAllCategories);
router.get('/:id', verifyToken, categoryController.getCategoryById);
router.patch('/:id', verifyToken, verifyAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, verifyAdmin, categoryController.deleteCategory);

// Subcategory Management (Admin only)
router.post('/:categoryId/subcategories', verifyToken, verifyAdmin, categoryController.addSubcategory);
router.post('/:categoryId/subcategories/:subcategoryId/products', verifyToken, verifyAdmin, categoryController.addProductToSubcategory);

module.exports = router;
