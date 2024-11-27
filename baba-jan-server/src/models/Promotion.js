const mongoose = require('mongoose');

// Define the schema for promotions
const PromotionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    promoCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['percentage', 'fixed', 'quantity-based', 'buy-one-get-one', 'custom'],
    },
    discountValue: {
      type: Number,
      required: function () {
        return ['percentage', 'fixed'].includes(this.type);
      },
      min: 0,
      validate: {
        validator: function (value) {
          if (this.type === 'percentage') return value <= 100; // Percentage discounts must be <= 100%
          return true;
        },
        message: 'Percentage discount must not exceed 100%.',
      },
    },
    condition: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible structure for conditions
      default: {},
    },
    applicableTo: {
      items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
      categories: [{ type: String }], // Categories by slug or ID
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      regions: [{ type: String }], // Regions by slug or ID
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date.',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: 0, // 0 = unlimited
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    priority: {
      type: Number,
      default: 1, // Higher priority promotions are applied first
      min: 1,
    },
    autoDeactivate: {
      type: Boolean,
      default: true, // Automatically deactivate if expired or usage limit reached
    },
    alertThreshold: {
      usage: {
        type: Number,
        default: 0, // Alert when usage approaches this value
      },
      expiration: {
        type: Date, // Alert when nearing expiration
      },
    },
    analytics: {
      totalDiscountGiven: {
        type: Number,
        default: 0, // Track total discount applied
      },
      usersClaimed: {
        type: Number,
        default: 0, // Track how many users have claimed this promotion
      },
    },
    tags: {
      type: [String],
      default: [], // Tags for grouping or searching promotions
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deletedAt: {
      type: Date,
    },
    deletedReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Middleware to validate promotion dates
PromotionSchema.pre('save', function (next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('End date must be after start date.'));
  }
  next();
});

// Middleware to update `updatedAt` on update
PromotionSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Method to mark a promotion as used
PromotionSchema.methods.incrementUsage = async function () {
  this.usageCount += 1;
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    this.isActive = false; // Deactivate promotion if usage limit is reached
  }
  return this.save();
};

// Method to calculate discount for an order
PromotionSchema.methods.calculateDiscount = function (orderTotal) {
  if (this.type === 'percentage') {
    return (this.discountValue / 100) * orderTotal;
  } else if (this.type === 'fixed') {
    return Math.min(this.discountValue, orderTotal);
  }
  // Add logic for other types as needed
  return 0;
};

// Method to check if the promotion is applicable
PromotionSchema.methods.isApplicable = function (order) {
  const now = new Date();
  if (!this.isActive || this.startDate > now || this.endDate < now) {
    return false;
  }
  // Add additional checks based on conditions
  return true;
};

// Static method to find active promotions
PromotionSchema.statics.findActive = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
  });
};

// Static method to get promotions by tag
PromotionSchema.statics.findByTag = function (tag) {
  return this.find({ tags: tag });
};

// Soft delete method
PromotionSchema.methods.softDelete = async function (reason) {
  this.isActive = false; // Deactivate the promotion
  this.deletedReason = reason || 'No reason provided';
  this.deletedAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Promotion', PromotionSchema);
