const Item = require('../../../models/Item');
const { validateItem } = require('../../../utils/validators');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Update an existing item
 * @param {Object} req - Request object containing updated item details
 * @param {Object} res - Response object
 */
exports.updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { error } = validateItem(req.body);

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  // Handle price adjustment based on unit
  if (req.body.unit === 'kg' && req.body.price) {
    req.body.price = req.body.price / 1000; // Adjust price per gram if needed
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) {
    handleError(res, err);
  }
};
