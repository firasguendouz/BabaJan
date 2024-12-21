// controllers/admin/orders/addOrderEvent.js

const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');

exports.addOrderEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, duration } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.events.push({ status, duration });
    await order.save();

    res.status(200).json({ success: true, message: 'Order event added.', data: order });
  } catch (err) {
    console.error('Error adding order event:', err.message);
    handleError(res, err);
  }
};
