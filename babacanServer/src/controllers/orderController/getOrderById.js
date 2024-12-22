// controllers/admin/orders/getOrderById.js
const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');
const { logInfo, logError } = require('./utils/orderUtils');

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    logInfo('Fetching order by ID', { orderId: id });

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    logError('Error fetching order by ID', { error: err.message });
    handleError(res, err);
  }
};
