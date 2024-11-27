const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define the schema for products (items)
const ItemSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (url) => /^https?:\/\//.test(url),
      message: 'Thumbnail URL must be valid.',
    },
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory', // Reference to the Subcategory model
    required: true,
  },
  subcategoryName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', ItemSchema);
