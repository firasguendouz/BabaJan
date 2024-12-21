const { getCategoryById, getSubcategoryById, handleControllerError } = require('./adminUtils');

async function updateProduct(req, res) {
  try {
    const { categoryId, subcategoryId, productId } = req.params;
    const updates = req.body;

    const category = await getCategoryById(categoryId);
    const subcategory = getSubcategoryById(category, subcategoryId);
    const product = subcategory.products.id(productId);

    if (!product) throw new Error('Product not found.');

    Object.assign(product, updates);
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (err) {
    handleControllerError(res, err);
  }
}

module.exports = updateProduct;
