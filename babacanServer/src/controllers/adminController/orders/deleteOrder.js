const Order = require('../../../models/Order');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Soft delete an order
 * @param {Object} req - Request object containing order ID
 * @param {Object} res - Response object
 */
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.softDelete('Admin deleted order', req.adminId);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
