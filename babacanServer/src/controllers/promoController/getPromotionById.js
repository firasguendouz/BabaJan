/**
 * Get a promotion by its ID.
 * 
 * This controller function retrieves a single promotion document 
 * from the database by its unique MongoDB ID.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - The ID of the promotion to fetch.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function getPromotionById(req, res) {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: promotion,
    });
  } catch (err) {
    console.error('Error fetching promotion:', err.message);
    handleError(res, err);
  }
}

module.exports = getPromotionById;
