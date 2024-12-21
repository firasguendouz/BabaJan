const Item = require('../../../models/Item');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Soft delete an item
 * @param {Object} req - Request object containing item ID
 * @param {Object} res - Response object
 */
exports.deleteItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    await item.softDelete();
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
