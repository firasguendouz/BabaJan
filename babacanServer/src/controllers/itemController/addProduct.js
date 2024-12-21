const Item = require('../../models/Item');
const { getCategoryById, getSubcategoryById, handleControllerError } = require('./adminUtils');

async function addProduct(req, res) {
  try {
    const { categoryId, subcategoryId } = req.params;
    const productData = req.body;

    const category = await getCategoryById(categoryId);
    const subcategory = getSubcategoryById(category, subcategoryId);

    let product = await Item.findOne({ sku: productData.sku });
    if (!product) {
      product = new Item({
        ...productData,
        category: categoryId,
        categoryName: category.title,
        subcategory: subcategoryId,
        subcategoryName: subcategory.name,
      });
      await product.save();
    }

    subcategory.products.push(product._id);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      data: product,
    });
  } catch (err) {
    handleControllerError(res, err);
  }
}

module.exports = addProduct;
