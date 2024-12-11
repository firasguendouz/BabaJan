const Category = require('../models/Category');
const { handleError } = require('../middleware/errorHandler'); // Error handler
// Make sure you import the Item model
const Item = require('../models/Item'); // Adjust the path as needed

const itemController = {};

// Add a product to a subcategory
itemController.addProduct = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const productData = req.body;

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Find the subcategory
    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    // Create the product (or find it if it already exists)
    let product = await Item.findOne({ sku: productData.sku });
    if (!product) {
      // If product doesn't exist, create a new product
      product = new Item({
        sku: productData.sku,
        name: productData.name,
        slug: productData.slug,
        quantity: productData.quantity,
        thumbnail: productData.thumbnail,
        price: productData.price,
        category: categoryId, // Reference to the current category
        categoryName: category.title, // Add the category name here
        subcategory: subcategoryId, // Reference to the current subcategory
        subcategoryName: subcategory.name, // Add the subcategory name here
      });

      // Save the new product
      await product.save();
    }

    // Add the product's ObjectId to the subcategory's products array
    subcategory.products.push(product._id);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully.',
      data: product,
    });
  } catch (err) {
    console.error('Error adding product:', err.message);
    handleError(res, err);
  }
};




// Get all products from a subcategory
itemController.getAllProducts = async (req, res) => {
  try {
    const products = await Item.find(); // Fetch all items
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Get a single product by ID
itemController.getProductById = async (req, res) => {
  try {
    const { categoryId, subcategoryId, productId } = req.params;

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Find the subcategory
    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    // Find the product
    const product = subcategory.products.id(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error('Error fetching product by ID:', err.message);
    handleError(res, err);
  }
};

// Update a product by ID
itemController.updateProduct = async (req, res) => {
  try {
    const { categoryId, subcategoryId, productId } = req.params;
    const updates = req.body;

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Find the subcategory
    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    // Find the product
    const product = subcategory.products.id(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Update the product
    Object.assign(product, updates);
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (err) {
    console.error('Error updating product:', err.message);
    handleError(res, err);
  }
};

// Delete a product by ID
itemController.deleteProduct = async (req, res) => {
  try {
    const { categoryId, subcategoryId, productId } = req.params;

    // Find the category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Find the subcategory
    const subcategory = category.subcategories.id(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'Subcategory not found.' });
    }

    // Find and remove the product
    const product = subcategory.products.id(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    product.remove();
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (err) {
    console.error('Error deleting product:', err.message);
    handleError(res, err);
  }
};

module.exports = itemController;
