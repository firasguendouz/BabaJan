const Category = require('../../models/Category');
const { isValidObjectId } = require('../../utils/helpers');
const { handleError } = require('../../middleware/errorHandler');

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    console.error('Error fetching category by ID:', err.message);
    handleError(res, err);
  }
}

module.exports = getCategoryById;
