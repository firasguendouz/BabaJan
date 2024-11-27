const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define schema for order events
const EventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  duration: { type: Number, required: true, min: 1, max: 86400 }, // Duration: Min 1 sec, Max 1 day
});

// Define schema for order fees
const FeeSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['shipping', 'handling', 'tax', 'service'] },
  name: { type: String, required: true },
  price: {
    currency: { type: String, default: 'EUR' },
    amount: { type: Number, required: true, min: 0 },
    amount_decimal: { type: Number, required: true, min: 0 },
  },
});

// Define schema for order items (lines)
const OrderLineSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  quantity: { type: Number, required: true, min: 1 },
  variant_id: { type: String, required: true },
  total_price: {
    currency: { type: String, default: 'EUR' },
    amount: { type: Number, required: true, min: 0 },
    amount_decimal: { type: Number, required: true, min: 0 },
  },
  product_name: { type: String, required: true },
  product_sku: { type: String, required: true },
  thumbnail: { type: String },
  unit_price: {
    currency: { type: String, default: 'EUR' },
    amount: { type: Number, required: true, min: 0 },
    amount_decimal: { type: Number, required: true, min: 0 },
  },
  product_category: { type: String, required: true },
});

// Define schema for shipping address
const ShippingAddressSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  address_id: { type: String, default: uuidv4 },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  company_name: { type: String },
  street_address_1: { type: String, required: true },
  street_address_2: { type: String },
  comment: { type: String },
  city: { type: String, required: true },
  postal_code: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String },
  tag: { type: String },
  house_number: { type: String },
  floor_number: { type: String },
  name_on_doorbell: { type: String },
  building_location: { type: String },
  building_type: { type: String },
  entrance: { type: String },
  is_elevator_available: { type: Boolean, default: false },
});

// Define schema for orders
const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    token: { type: String, default: uuidv4 },
    number: { type: String, required: true, unique: true },
    created: { type: Date, default: Date.now },
    tracking_client_id: { type: String, default: '' },
    status: { type: String, enum: ['STATE_PENDING', 'STATE_IN_TRANSIT', 'STATE_DELIVERED', 'STATE_CANCELLED'], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subtotal: {
      currency: { type: String, default: 'EUR' },
      amount: { type: Number, required: true, min: 0 },
      amount_decimal: { type: Number, required: true, min: 0 },
    },
    shipping_price: {
      currency: { type: String, default: 'EUR' },
      amount: { type: Number, default: 0, min: 0 },
      amount_decimal: { type: Number, default: 0, min: 0 },
    },
    discount: {
      currency: { type: String, default: 'EUR' },
      amount: { type: Number, default: 0, min: 0 },
      amount_decimal: { type: Number, default: 0, min: 0 },
    },
    storage_fee: { type: Number, default: null },
    events: [EventSchema],
    total: {
      currency: { type: String, default: 'EUR' },
      amount: { type: Number, required: true, min: 0 },
      amount_decimal: { type: Number, required: true, min: 0 },
    },
    lines: [OrderLineSchema],
    shipping_address: ShippingAddressSchema,
    shipping_info: {
      shipping_method_name: { type: String, required: true },
    },
    hub_details: {
      slug: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    delivery_state: { type: String, enum: ['PENDING', 'IN_TRANSIT', 'DELIVERED'], required: true },
    cancellation: { type: String, default: null },
    fees: [FeeSchema],
    refundable: { type: Boolean, default: false },
    report_data: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

// Add indexes for performance optimization
OrderSchema.index({ status: 1 });
OrderSchema.index({ created: -1 });

module.exports = mongoose.model('Order', OrderSchema);
