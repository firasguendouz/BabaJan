// controllers/admin/orders/getOrderById.js

const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    console.error('Error fetching order:', err.message);
    handleError(res, err);
  }
};
