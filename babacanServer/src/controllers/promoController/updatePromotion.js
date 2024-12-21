/**
 * Update a promotion by its ID.
 * 
 * This controller function updates an existing promotion 
 * with new data provided in the request body.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.id - The ID of the promotion to update.
 * @param {Object} req.body - Data to update the promotion with.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function updatePromotion(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promotion updated successfully.',
      data: updatedPromotion,
    });
  } catch (err) {
    console.error('Error updating promotion:', err.message);
    handleError(res, err);
  }
}

module.exports = updatePromotion;
