/**
 * Soft delete a promotion.
 * 
 * This controller function marks a promotion as deleted by 
 * calling the custom "softDelete" method on the Promotion model.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - The ID of the promotion to delete.
 * @param {string} [req.body.reason] - The reason for deletion (optional).
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function deletePromotion(req, res) {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found.',
      });
    }

    // Custom method on your Promotion model to handle soft deletion
    await promotion.softDelete(reason);

    res.status(200).json({
      success: true,
      message: 'Promotion soft deleted successfully.',
    });
  } catch (err) {
    console.error('Error soft deleting promotion:', err.message);
    handleError(res, err);
  }
}

module.exports = deletePromotion;
