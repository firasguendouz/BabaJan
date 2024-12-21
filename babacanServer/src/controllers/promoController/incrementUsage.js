/**
 * Increment the usage of a promotion.
 * 
 * This controller function increments the usage count 
 * of a specific promotion by calling a custom model method.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - The ID of the promotion to increment usage for.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function incrementUsage(req, res) {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found.',
      });
    }

    // Custom method on your Promotion model to increment usage
    await promotion.incrementUsage();

    res.status(200).json({
      success: true,
      message: 'Promotion usage incremented successfully.',
      data: promotion,
    });
  } catch (err) {
    console.error('Error incrementing promotion usage:', err.message);
    handleError(res, err);
  }
}

module.exports = incrementUsage;
