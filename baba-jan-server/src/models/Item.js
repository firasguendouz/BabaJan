const mongoose = require('mongoose');

// Define the schema for items
const ItemSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      de: { type: String, trim: true },
    },
    description: {
      en: { type: String, trim: true },
      de: { type: String, trim: true },
    },
    category: {
      type: String,
      required: true,
      enum: ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Others'],
    },
    photos: {
      type: [String],
      default: [],
      validate: {
        validator: function (photos) {
          return photos.every(photo => /^https?:\/\//.test(photo));
        },
        message: 'All photo URLs must be valid',
      },
    },
    unit: {
      type: String,
      default: 'piece',
      enum: ['piece', 'kg', 'grams', 'liter', 'box'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    purchasedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Mark item as deleted for soft deletes
    },
  },
  { timestamps: true }
);

// Method for soft deletion
ItemSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Static query to exclude deleted items by default
ItemSchema.statics.findActive = function () {
  return this.find({ isDeleted: false });
};

module.exports = mongoose.model('Item', ItemSchema);
