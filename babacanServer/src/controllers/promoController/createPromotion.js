/**
 * Create a new promotion.
 * 
 * This controller function creates a new promotion document 
 * in the database using the provided request body.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Data for the new promotion.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function createPromotion(req, res) {
  try {
    const promotionData = req.body;
    const newPromotion = new Promotion(promotionData);
    await newPromotion.save();

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully.',
      data: newPromotion,
    });
  } catch (err) {
    console.error('Error creating promotion:', err.message);
    handleError(res, err);
  }
}

module.exports = createPromotion;
