// utils/orderUtils.js
const Order = require('../../../models/Order');
const { handleError } = require('../../../middleware/errorHandler');

// Utility function for logging
exports.logInfo = (message, meta = {}) => {
  console.info(`[INFO] ${message}`, meta);
};

exports.logError = (message, meta = {}) => {
  console.error(`[ERROR] ${message}`, meta);
};

// Validate Order Status
exports.isValidOrderStatus = (status) => {
  const validStatuses = ['STATE_PENDING', 'STATE_DELIVERED', 'STATE_CANCELLED'];
  return validStatuses.includes(status);
};

// Save order with logging
exports.saveOrder = async (order) => {
  try {
    await order.save();
    exports.logInfo('Order saved successfully', { orderId: order.id });
  } catch (err) {
    exports.logError('Error saving order', { error: err.message });
    throw err;
  }
};
