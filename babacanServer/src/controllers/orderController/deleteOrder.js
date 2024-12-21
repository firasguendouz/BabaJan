// controllers/admin/orders/deleteOrder.js

const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await order.softDelete(reason);
    res.status(200).json({ success: true, message: 'Order deleted successfully.' });
  } catch (err) {
    console.error('Error deleting order:', err.message);
    handleError(res, err);
  }
};
