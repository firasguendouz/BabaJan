const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Subcategory Schema
const SubcategorySchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4, // Unique ID
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true, // Enforce unique slugs for subcategories
  },
  name: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

// Main Category Schema
const CategorySchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  subcategories: [SubcategorySchema], // Array of subcategories
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
