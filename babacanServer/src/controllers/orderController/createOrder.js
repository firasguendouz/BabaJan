// controllers/admin/orders/createOrder.js
const Order = require('../../models/Order');
const User = require('../../models/User');
const { validatePhoneNumber, saveOrder, logInfo, logError } = require('./utils/orderUtils');
const { handleError } = require('../../middleware/errorHandler');

exports.createOrder = async (req, res) => {
  try {
    const { lines, shipping_address, shipping_info } = req.body;
    logInfo('Creating new order', { userId: req.user._id });

    if (!lines || !shipping_address || !shipping_info) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const phone = user.phone || req.body.phone;
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
    }

    const orderNumber = `ORD-${phone}-${Date.now()}`;
    const subtotal = lines.reduce((sum, item) => sum + item.unit_price.amount * item.quantity, 0);

    const newOrder = new Order({
      number: orderNumber,
      status: 'STATE_PENDING',
      subtotal: { currency: 'EUR', amount: subtotal, amount_decimal: subtotal * 100 },
      total: { currency: 'EUR', amount: subtotal, amount_decimal: subtotal * 100 },
      lines,
      shipping_address,
      shipping_info,
      userId: req.user._id,
    });

    await saveOrder(newOrder);

    res.status(201).json({ success: true, message: 'Order created successfully.', data: newOrder });
  } catch (err) {
    logError('Order creation failed', { error: err.message });
    handleError(res, err);
  }
};
