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
      
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (phone) {
          return /^\+49\d{10}$/.test(phone);
        },
        message: 'Invalid German phone number (must start with +49)',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super-admin'],
      default: 'user',
    },
    permissions: {
      type: [String],
      default: [],
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
    lockUntil: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    orderCount: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    preferences: {
      type: Map,
      of: String,
      default: {},
    },
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

// Method for soft deletion
UserSchema.methods.softDelete = function (reason, deletedBy) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedReason = reason || 'No reason specified';
  this.deletedBy = deletedBy || null;
  return this.save();
};

// Method to check if user is locked
UserSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to generate reset password token
UserSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
  return token;
};

// Static query to exclude deleted users by default
UserSchema.statics.findActive = function () {
  return this.find({ isDeleted: false });
};

module.exports = mongoose.model('User', UserSchema);
