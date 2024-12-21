const Category = require('../../models/Category');
const { handleError } = require('../../middleware/errorHandler');

async function addProductToSubcategory(req, res) {
  try {
    const { categoryId, subcategoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    subcategory.products.push(req.body);
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Product added to subcategory successfully.',
      data: subcategory,
    });
  } catch (err) {
    console.error('Error adding product to subcategory:', err.message);
    handleError(res, err);
  }
}

module.exports = addProductToSubcategory;
