// controllers/admin/orders/getAllOrders.js
const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');
const { logInfo, logError } = require('./orderUtils');

exports.getAllOrders = async (req, res) => {
  try {
    logInfo('Fetching all orders');
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    logError('Error fetching orders', { error: err.message });
    handleError(res, err);
  }
};
