/**
 * Get all promotions.
 * 
 * This controller function fetches all promotion documents 
 * from the database, sorted by priority and start date.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function getAllPromotions(req, res) {
  try {
    const promotions = await Promotion.find().sort({ priority: -1, startDate: -1 });
    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (err) {
    console.error('Error fetching promotions:', err.message);
    handleError(res, err);
  }
}

module.exports = getAllPromotions;
