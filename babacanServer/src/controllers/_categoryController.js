const Category = require('../models/Category');
const validators = require('../utils/validators'); // Validation utility
const helpers = require('../utils/helpers'); // Utility functions
const { handleError } = require('../middleware/errorHandler'); // Error handler

const categoryController = {};

// Create a new category
categoryController.createCategory = async (req, res) => {
  try {
    const { error } = validators.validateCategory(req.body); // Use the function from validators.js
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
};

// Get all categories
categoryController.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    handleError(res, err);
  }
};

// Get a category by ID
categoryController.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!helpers.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    console.error('Error fetching category by ID:', err.message);
    handleError(res, err);
  }
};

// Update a category
categoryController.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!helpers.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }

    const { error } = validators.validateCategory(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: updatedCategory,
    });
  } catch (err) {
    console.error('Error updating category:', err.message);
    handleError(res, err);
  }
};

// Delete a category
categoryController.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!helpers.isValidObjectId(id)) {
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
};

// Add a subcategory to a category
categoryController.addSubcategory = async (req, res) => {
    try {
      const { categoryId } = req.params; // Use categoryId from params
  
      if (!helpers.isValidObjectId(categoryId)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID.' });
      }
  
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }
  
      // Push the new subcategory into the category's subcategories array
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
  };
  

// Add a product to a subcategory
categoryController.addProductToSubcategory = async (req, res) => {
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
};

module.exports = categoryController;
