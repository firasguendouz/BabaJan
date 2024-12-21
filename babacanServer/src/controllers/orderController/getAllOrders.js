// controllers/admin/orders/getAllOrders.js

const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    handleError(res, err);
  }
};
