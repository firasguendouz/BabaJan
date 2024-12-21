const Category = require('../../models/Category');
const { handleError } = require('../../middleware/errorHandler');

async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    handleError(res, err);
  }
}

module.exports = getAllCategories;
