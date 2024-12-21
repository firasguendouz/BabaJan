/**
 * Restore a soft-deleted promotion.
 * 
 * This controller function sets a promotion's "deletedAt" 
 * and "deletedReason" fields to null to restore it.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - The ID of the promotion to restore.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function restorePromotion(req, res) {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndUpdate(
      id,
      {
        isActive: true,
        deletedAt: null,
        deletedReason: null,
      },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promotion restored successfully.',
      data: promotion,
    });
  } catch (err) {
    console.error('Error restoring promotion:', err.message);
    handleError(res, err);
  }
}

module.exports = restorePromotion;
