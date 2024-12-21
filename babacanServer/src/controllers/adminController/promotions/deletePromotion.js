const Promotion = require('../../../models/Promotion');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Soft delete a promotion
 * @param {Object} req - Request object containing promotion ID
 * @param {Object} res - Response object
 */
exports.deletePromotion = async (req, res) => {
  const { promoId } = req.params;

  try {
    const promotion = await Promotion.findById(promoId);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found' });
    }

    await promotion.softDelete('Admin deleted promotion');
    res.status(200).json({ success: true, message: 'Promotion deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
