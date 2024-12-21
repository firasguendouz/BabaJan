const Order = require('../../../models/Order');
const OrderAudit = require('../../../models/OrderAudit');
const Notification = require('../../../models/Notification');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Update the status of an order and log the action
 * @param {Object} req - Request object containing order details
 * @param {Object} res - Response object
 */
exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });
    await order.save();

    await OrderAudit.create({
      orderId,
      adminId: req.adminId,
      action: 'Status Updated',
      details: `Order status updated to ${status}`,
    });

    await Notification.create({
      recipient: order.userId,
      type: 'order',
      title: 'Order Status Updated',
      message: `Your order #${orderId} is now ${status}.`,
    });

    res.status(200).json({ success: true, message: 'Order status updated successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
