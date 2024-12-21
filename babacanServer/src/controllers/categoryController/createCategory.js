const Category = require('../../models/Category');
const { validateCategory } = require('../../utils/validators');
const { handleError } = require('../../middleware/errorHandler');

async function createCategory(req, res) {
  try {
    const { error } = validateCategory(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const newCategory = new Category(req.body);
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: newCategory,
    });
  } catch (err) {
    console.error('Error creating category:', err.message);
    handleError(res, err);
  }
}

module.exports = createCategory;
