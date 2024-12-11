const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Define the schema for users
const UserSchema = new mongoose.Schema(
  {
    name: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Simple email regex
        },
        message: 'Invalid email format.',
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (phone) {
          return /^\+49\d{10}$/.test(phone); // Validates German phone numbers starting with +49
        },
        message: 'Invalid German phone number (must start with +49 and have 10 digits after).',
      },
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      required: function () {
        return this.isNew;
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
    },
    address: [
      {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, default: 'Germany', trim: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    orderCount: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedReason: { type: String, trim: true },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastLogin: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate reset password token
UserSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
  return token;
};

// Method for soft deletion
UserSchema.methods.softDelete = function (reason, deletedBy) {
  this.isDeleted = true;
  this.isActive = false;
  this.deletedAt = new Date();
  this.deletedReason = reason || 'No reason specified';
  this.deletedBy = deletedBy || null;
  return this.save();
};

// Method to check if the user is locked
UserSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to unlock the user
UserSchema.methods.unlockAccount = function () {
  this.lockUntil = null;
  this.loginAttempts = 0;
  return this.save();
};

// Static query to find active users
UserSchema.statics.findActive = function () {
  return this.find({ isDeleted: false, isActive: true });
};

// Static method to lock a user
UserSchema.statics.lockUser = async function (userId, duration = 3600000) {
  const lockUntil = new Date(Date.now() + duration);
  return this.findByIdAndUpdate(userId, { lockUntil, loginAttempts: 0 });
};

// Middleware to prevent deletion of super-admins
UserSchema.pre('remove', function (next) {
  if (this.role === 'super-admin') {
    next(new Error('Super-admin accounts cannot be deleted.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('User', UserSchema);
