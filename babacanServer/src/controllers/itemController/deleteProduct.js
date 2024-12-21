const { getCategoryById, getSubcategoryById, handleControllerError } = require('./adminUtils');

async function deleteProduct(req, res) {
  try {
    const { categoryId, subcategoryId, productId } = req.params;

    const category = await getCategoryById(categoryId);
    const subcategory = getSubcategoryById(category, subcategoryId);
    const product = subcategory.products.id(productId);

    if (!product) throw new Error('Product not found.');

    product.remove();
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (err) {
    handleControllerError(res, err);
  }
}

module.exports = deleteProduct;
