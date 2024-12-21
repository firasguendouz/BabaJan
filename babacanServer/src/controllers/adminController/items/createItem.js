const Item = require('../../../models/Item');
const { validateItem } = require('../../../utils/validators');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Create a new item
 * @param {Object} req - Request object containing item details
 * @param {Object} res - Response object
 */
exports.createItem = async (req, res) => {
  console.log('Incoming Item Data:', req.body);
  const { error } = validateItem(req.body);

  if (error) {
    console.error('Validation Error:', error.details[0].message);
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  // Handle price adjustment based on unit
  if (req.body.unit === 'kg' && req.body.price) {
    req.body.price = req.body.price / 1000; // Adjust price per gram if needed
  }

  try {
    const newItem = await Item.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    console.error('Database Error:', err.message);
    handleError(res, err);
  }
};
