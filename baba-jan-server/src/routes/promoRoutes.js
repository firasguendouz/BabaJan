const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promoController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');


// Get all promotions
router.get('/',  promotionController.getAllPromotions);

// Get active promotions
router.get('/active',  promotionController.getActivePromotions);

// Get a promotion by ID
router.get('/:id', verifyToken, promotionController.getPromotionById);


// Increment promotion usage
router.patch('/:id/usage', verifyToken, promotionController.incrementUsage);

// Get promotions by tag
router.get('/tag/:tag', verifyToken, promotionController.getPromotionsByTag);

module.exports = router;
