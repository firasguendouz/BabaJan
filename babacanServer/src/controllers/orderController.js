const Order = require('../models/Order');
const { handleError } = require('../middleware/errorHandler'); // Error handler
const User = require('../models/User');

const orderController = {};

// Create a new order
// Create a new order
orderController.createOrder = async (req, res) => {
  try {
    const { lines, shipping_address, shipping_info } = req.body;

    // Validate request body
    if (!lines || !shipping_address || !shipping_info) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    // Fetch user from database
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: `User not found.${userId}` });
    }

    // Derive the order number
    let phone = user.phone;
    if (!phone) {
      // Require the phone number if not present
      if (!req.body.phone) {
        return res
          .status(400)
          .json({ success: false, message: 'Phone number is required for this order.' });
      }

      // Validate phone number format
      const phoneRegex = /^\+49\d{10}$/;
      if (!phoneRegex.test(req.body.phone)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid German phone number (must start with +49 and have 10 digits after).',
        });
      }

      // Save the phone number to the user's record
      phone = req.body.phone;
      user.phone = phone;
      await user.save();
    }

    // Generate a unique order number using the phone number
    const orderNumber = `ORD-${phone}-${Date.now()}`;

    // Calculate subtotal and total
    const subtotal = lines.reduce((sum, item) => sum + item.unit_price.amount * item.quantity, 0);
    const total = subtotal; // Add additional fees dynamically if needed

    // Provide default hub details
    const hub_details = {
      slug: 'default-hub',
      city: 'Default City',
      country: 'Default Country',
    };

    // Create a new order
    const newOrder = new Order({
      number: orderNumber,
      status: 'STATE_PENDING',
      subtotal: { currency: 'EUR', amount: subtotal, amount_decimal: subtotal * 100 },
      total: { currency: 'EUR', amount: total, amount_decimal: total * 100 },
      lines,
      shipping_address,
      shipping_info,
      hub_details,
      userId,
    });

    // Save the order to the database
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: newOrder,
    });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ success: false, message: 'Order creation failed.', error: err.message });
  }
};

// Get all orders
orderController.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.error('Error fetching orders:', err.message);
    handleError(res, err);
  }
};

// Get an order by ID
orderController.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error('Error fetching order:', err.message);
    handleError(res, err);
  }
};

// Update an order status
orderController.updateOrderStatus = async (req, res) => {
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

    // Update status and add to status history
    order.status = status;
    order.events.push({ status, duration: 0 }); // Add duration logic if required
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully.',
      data: order,
    });
  } catch (err) {
    console.error('Error updating order status:', err.message);
    handleError(res, err);
  }
};

// Add an event to an order
orderController.addOrderEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, duration } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.events.push({ status, duration });
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order event added successfully.',
      data: order,
    });
  } catch (err) {
    console.error('Error adding order event:', err.message);
    handleError(res, err);
  }
};

// Soft delete an order
orderController.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await order.softDelete(reason);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully.',
    });
  } catch (err) {
    console.error('Error deleting order:', err.message);
    handleError(res, err);
  }
};

// Restore a soft-deleted order
orderController.restoreOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedReason: null },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Order restored successfully.',
      data: order,
    });
  } catch (err) {
    console.error('Error restoring order:', err.message);
    handleError(res, err);
  }
};

module.exports = orderController;
