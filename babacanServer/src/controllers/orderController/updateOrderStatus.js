// controllers/admin/orders/updateOrderStatus.js
const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');
const { isValidOrderStatus, saveOrder, logInfo, logError } = require('./orderUtils');

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    logInfo('Updating order status', { orderId: id, status });

    if (!isValidOrderStatus(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    order.events.push({ status, duration: 0 });
    await saveOrder(order);

    res.status(200).json({ success: true, message: 'Order status updated.', data: order });
  } catch (err) {
    logError('Error updating order status', { error: err.message });
    handleError(res, err);
  }
};
