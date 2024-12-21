// controllers/admin/orders/updateOrderStatus.js

const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['STATE_PENDING', 'STATE_DELIVERED', 'STATE_CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    order.events.push({ status, duration: 0 });
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated.', data: order });
  } catch (err) {
    console.error('Error updating status:', err.message);
    handleError(res, err);
  }
};
