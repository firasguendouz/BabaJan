const Category = require('../../models/Category');
const { isValidObjectId } = require('../../utils/helpers');
const { handleError } = require('../../middleware/errorHandler');

async function addSubcategory(req, res) {
  try {
    const { categoryId } = req.params;

    if (!isValidObjectId(categoryId)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    category.subcategories.push(req.body);
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Subcategory added successfully.',
      data: category,
    });
  } catch (err) {
    console.error('Error adding subcategory:', err.message);
    handleError(res, err);
  }
}

module.exports = addSubcategory;
