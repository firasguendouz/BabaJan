const Promotion = require('../../../models/Promotion');
const { validatePromotion } = require('../../../utils/validators');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Create or update a promotion
 * @param {Object} req - Request object containing promotion details
 * @param {Object} res - Response object
 */
exports.createOrUpdatePromotion = async (req, res) => {
  const { promoId } = req.body;
  const { error } = validatePromotion(req.body);

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    let promotion;
    if (promoId) {
      promotion = await Promotion.findByIdAndUpdate(promoId, req.body, { new: true });
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }
    } else {
      promotion = await Promotion.create(req.body);
    }

    res.status(201).json({ success: true, data: promotion });
  } catch (err) {
    handleError(res, err);
  }
};
