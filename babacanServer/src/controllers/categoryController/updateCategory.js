const Category = require('../../models/Category');
const { validateCategory } = require('../../utils/validators');
const { isValidObjectId } = require('../../utils/helpers');
const { handleError } = require('../../middleware/errorHandler');

async function updateCategory(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: updatedCategory,
    });
  } catch (err) {
    console.error('Error updating category:', err.message);
    handleError(res, err);
  }
}

module.exports = updateCategory;
