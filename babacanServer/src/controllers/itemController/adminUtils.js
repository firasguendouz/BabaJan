const Category = require('../../models/Category');
const { handleError } = require('../../middleware/errorHandler');

/**
 * Utility to fetch a category by ID.
 */
async function getCategoryById(categoryId) {
  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Category not found.');
  return category;
}

/**
 * Utility to fetch a subcategory by ID.
 */
function getSubcategoryById(category, subcategoryId) {
  const subcategory = category.subcategories.id(subcategoryId);
  if (!subcategory) throw new Error('Subcategory not found.');
  return subcategory;
}

/**
 * Centralized error handler.
 */
function handleControllerError(res, err) {
  console.error('Controller Error:', err.message);
  handleError(res, err);
}

module.exports = {
  getCategoryById,
  getSubcategoryById,
  handleControllerError,
};
