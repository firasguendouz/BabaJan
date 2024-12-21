/**
 * Get active promotions.
 * 
 * This controller function fetches only active promotions 
 * where the current date is between the promotion's start 
 * and end dates, sorted by priority.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function getActivePromotions(req, res) {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      isActive: true, 
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ priority: -1 });

    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (err) {
    console.error('Error fetching active promotions:', err.message);
    handleError(res, err);
  }
}

module.exports = getActivePromotions;
