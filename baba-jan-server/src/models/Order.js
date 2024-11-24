const mongoose = require('mongoose');

// Define schema for order items
const OrderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  name: {
    type: String,
    required: true, // Store item name at the time of order
  },
  unit: {
    type: String,
    enum: ['piece', 'kg', 'grams', 'liter', 'box'],
    required: true, // Capture unit of the item for the order
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price of one unit of the item
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  total: {
    type: Number,
    required: true, // Calculated as price * quantity
  },
});

// Define schema for orders
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalAmount: {
      type: Number,
      default: function () {
        return this.totalAmount + this.taxAmount - this.discountAmount;
      },
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'prepared', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    paymentDetails: {
      method: {
        type: String,
        enum: ['cash-on-delivery', 'stripe', 'paypal', 'other'],
        required: true,
      },
      transactionId: {
        type: String,
        required: function () {
          return this.paymentDetails.method !== 'cash-on-delivery';
        },
      },
      paidAt: {
        type: Date,
      },
    },
    deliveryInfo: {
      type: new mongoose.Schema({
        type: { type: String, enum: ['pickup', 'delivery'], required: true },
        address: { type: String, required: function () { return this.type === 'delivery'; } },
        scheduledAt: { type: Date },
        deliveredAt: { type: Date, default: null },
      }),
      required: true,
    },
    orderCompletionTime: {
      type: Number, // Time in minutes from order creation to delivery
    },
    itemsCount: {
      type: Number,
      default: function () {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

// Pre-save hook for calculating totals and item count
OrderSchema.pre('save', function (next) {
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
    this.itemsCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
  next();
});

// Method for soft deletion
OrderSchema.methods.softDelete = function (reason) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedReason = reason || 'No reason specified';
  return this.save();
};

// Static query to exclude deleted orders by default
OrderSchema.statics.findActive = function () {
  return this.find({ isDeleted: false });
};

module.exports = mongoose.model('Order', OrderSchema);
