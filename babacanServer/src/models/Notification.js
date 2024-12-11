const mongoose = require('mongoose');

// Define the schema for notifications
const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['order', 'promo', 'system', 'custom', 'reminder', 'feedback'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
    deliveryMethod: {
      type: [String],
      enum: ['email', 'sms', 'push', 'telegram'],
      default: ['push'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default expiration: 7 days
    },
  },
  { timestamps: true }
);

// Static method to find unread notifications
NotificationSchema.statics.findUnreadByRecipient = function (userId) {
  return this.find({ recipient: userId, read: false });
};

module.exports = mongoose.model('Notification', NotificationSchema);
