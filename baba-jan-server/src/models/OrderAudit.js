const mongoose = require('mongoose');

// Define the schema for order audit logs
const OrderAuditSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the admin making the change
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['Created', 'Updated', 'Status Updated', 'Deleted'], // Define valid actions
    },
    details: {
      type: String,
      required: true, // Detailed explanation of the action
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Static method to fetch audit logs for an order
OrderAuditSchema.statics.getLogsByOrderId = function (orderId, limit = 10, skip = 0) {
  return this.find({ orderId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('adminId', 'name email'); // Populate admin details
};

// Static method to fetch logs by admin
OrderAuditSchema.statics.getLogsByAdminId = function (adminId, limit = 10, skip = 0) {
  return this.find({ adminId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('orderId', 'status totalAmount'); // Populate order details
};

module.exports = mongoose.model('OrderAudit', OrderAuditSchema);
