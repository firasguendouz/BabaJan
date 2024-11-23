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
      enum: [
        'order',
        'promotion',
        'system',
        'custom',
        'reminder',
        'feedback',
      ],
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
      of: mongoose.Schema.Types.Mixed, // Supports nested data structures
      default: {},
    },
    readStatus: [
      {
        method: { type: String, enum: ['email', 'sms', 'push', 'telegram'], required: true },
        read: { type: Boolean, default: false },
        readAt: { type: Date },
      },
    ],
    deliveryStatus: [
      {
        method: { type: String, enum: ['email', 'sms', 'push', 'telegram'], required: true },
        delivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
      },
    ],
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
    bulk: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['info', 'alert', 'promo', 'action'],
      default: 'info',
    },
    tags: {
      type: [String],
      default: [],
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default expiration: 7 days
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Method to mark the notification as read
NotificationSchema.methods.markAsRead = function (method) {
  const status = this.readStatus.find((r) => r.method === method);
  if (status) {
    status.read = true;
    status.readAt = new Date();
  }
  return this.save();
};

// Static method to fetch unread notifications
NotificationSchema.statics.findUnread = function (userId) {
  return this.find({ recipient: userId, 'readStatus.read': false });
};

// Pre-save hook to validate expiration
NotificationSchema.pre('save', function (next) {
  if (this.expiresAt && this.expiresAt < Date.now()) {
    return next(new Error('Cannot save expired notification.'));
  }
  next();
});

module.exports = mongoose.model('Notification', NotificationSchema);
