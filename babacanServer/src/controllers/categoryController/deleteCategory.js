const Category = require('../../models/Category');
const { isValidObjectId } = require('../../utils/helpers');
const { handleError } = require('../../middleware/errorHandler');

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Error deleting category:', err.message);
    handleError(res, err);
  }
}

module.exports = deleteCategory;
