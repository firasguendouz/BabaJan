/**
 * Get promotions by tag.
 * 
 * This controller function fetches all promotions associated 
 * with a specific tag, by calling a custom model method.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.tag - The tag to filter promotions by.
 * @param {Object} res - Express response object.
 */
const Promotion = require('../../models/Promotion');
const { handleError } = require('../../middleware/errorHandler');

async function getPromotionsByTag(req, res) {
  try {
    const { tag } = req.params;

    const promotions = await Promotion.findByTag(tag);
    if (!promotions.length) {
      return res.status(404).json({
        success: false,
        message: 'No promotions found for this tag.',
      });
    }

    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (err) {
    console.error('Error fetching promotions by tag:', err.message);
    handleError(res, err);
  }
}

module.exports = getPromotionsByTag;
