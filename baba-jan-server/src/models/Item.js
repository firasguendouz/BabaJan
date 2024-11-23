const mongoose = require('mongoose');

// Define the schema for items
const ItemSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true },
      de: { type: String, trim: true },
    },
    description: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true },
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
      enum: ['piece', 'kg', 'bunch', 'liter', 'box'],
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
    tags: {
      type: [String],
      default: [],
      enum: ['Organic', 'Seasonal', 'Imported', 'Local', 'Discounted'],
    },
    searchKeywords: {
      type: [String],
      default: [],
    },
    priceHistory: [
      {
        price: { type: Number, required: true },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, trim: true },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    seasonal: {
      type: Boolean,
      default: false,
    },
    onPromotion: {
      type: Boolean,
      default: false,
    },
    supplier: {
      name: { type: String, trim: true },
      contact: { type: String, trim: true },
    },
    dynamicPricing: {
      enabled: { type: Boolean, default: false },
      rules: [
        {
          condition: { type: String },
          action: { type: String },
        },
      ],
    },
    stockHistory: [
      {
        date: { type: Date, default: Date.now },
        change: { type: Number },
        reason: { type: String, trim: true },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
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
    deletedAt: {
      type: Date, // Record the date of soft deletion
    },
    version: {
      type: Number,
      default: 1,
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
