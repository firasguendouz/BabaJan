const express = require('express');
const promotionController = require('../controllers/promoController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Public Routes
router.get('/', promotionController.getAllPromotions); // Get all promotions

// Admin Routes
router.post('/', verifyToken, verifyAdmin, promotionController.createPromotion); // Create a new promotion
router.get('/:promoId', verifyToken, verifyAdmin, promotionController.getPromotionById); // Get promotion by ID
router.put('/:promoId', verifyToken, verifyAdmin, promotionController.updatePromotion);
router.delete('/:promoId', verifyToken, verifyAdmin, promotionController.deletePromotion); // Delete a promotion
router.patch('/:promoId/status', verifyToken, verifyAdmin, promotionController.togglePromotionStatus); // Toggle promotion status

module.exports = router;
