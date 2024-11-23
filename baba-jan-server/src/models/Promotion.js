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
    },
    condition: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Flexible structure for conditions
      default: {},
    },
    applicableTo: {
      items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
      categories: [{ type: String }],
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      regions: [{ type: String }],
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
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
      default: 1,
    },
    autoDeactivate: {
      type: Boolean,
      default: false,
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
        default: 0,
      },
      usersClaimed: {
        type: Number,
        default: 0,
      },
    },
    tags: {
      type: [String],
      default: [],
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

// Method to mark a promotion as used
PromotionSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    this.isActive = false; // Deactivate promotion if usage limit is reached
  }
  return this.save();
};
// Soft delete method
PromotionSchema.methods.softDelete = async function (reason) {
  this.isActive = false; // Deactivate the promotion
  this.deletedReason = reason || 'No reason provided'; // Optional: Add a reason field to the schema
  this.deletedAt = new Date(); // Optional: Add a deletedAt field to the schema
  return this.save();
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

module.exports = mongoose.model('Promotion', PromotionSchema);
