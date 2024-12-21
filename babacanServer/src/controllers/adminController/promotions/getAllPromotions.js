const Promotion = require('../../../models/Promotion');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Get all active promotions
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findActive();
    res.status(200).json({ success: true, data: promotions });
  } catch (err) {
    handleError(res, err);
  }
};
