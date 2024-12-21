const Order = require('../../../models/Order');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Fetch detailed information about a specific order
 * @param {Object} req - Request object containing order ID
 * @param {Object} res - Response object
 */
exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('userId', 'name email').populate('items.itemId');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    handleError(res, err);
  }
};
