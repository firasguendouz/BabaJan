// controllers/admin/orders/createOrder.js

const Order = require('../../models/Order');
const User = require('../../models/User');
const { validatePhoneNumber } = require('./orderUtils');
const { handleError } = require('../../middleware/errorHandler');

exports.createOrder = async (req, res) => {
  try {
    const { lines, shipping_address, shipping_info } = req.body;

    if (!lines || !shipping_address || !shipping_info) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: `User not found.${userId}` });
    }

    let phone = user.phone;
    if (!phone) {
      if (!req.body.phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required.' });
      }

      if (!validatePhoneNumber(req.body.phone)) {
        return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
      }

      phone = req.body.phone;
      user.phone = phone;
      await user.save();
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
      hub_details: { slug: 'default-hub', city: 'Default City', country: 'Default Country' },
      userId,
    });

    await newOrder.save();

    res.status(201).json({ success: true, message: 'Order created successfully.', data: newOrder });
  } catch (err) {
    console.error('Order creation failed:', err);
    handleError(res, err);
  }
};
