const Order = require('../models/Order');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const OrderAudit = require('../models/OrderAudit');
const { handleError } = require('../middleware/errorHandler');
const { validateOrder } = require('../utils/validators');
const orderController = {};

// ==================== ORDER MANAGEMENT ====================

// 1. Place a new order
orderController.placeOrder = async (req, res) => {
  const { items, deliveryInfo, paymentDetails } = req.body;

  try {
    // Validate request body
    const { error } = validateOrder(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: `Validation Error: ${error.details[0].message}` });
    }

    // Ensure paymentDetails are valid
    if (!paymentDetails || !paymentDetails.method) {
      return res.status(400).json({ success: false, message: 'Payment method is required.' });
    }
    if (paymentDetails.method !== 'cash-on-delivery' && !paymentDetails.transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required for non-cash payments.' });
    }

    // Ensure deliveryInfo is complete
    if (
      !deliveryInfo ||
      deliveryInfo.type === 'delivery' && 
      (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.postalCode || !deliveryInfo.country)
    ) {
      return res.status(400).json({ success: false, message: 'Delivery information is incomplete.' });
    }

    // Ensure authenticated user is available
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User authentication required.' });
    }

    // Check if items exist and are available
    const itemIds = items.map((item) => item.itemId);
    const availableItems = await Item.find({ _id: { $in: itemIds }, available: true });
    if (availableItems.length !== items.length) {
      return res.status(400).json({ success: false, message: 'Some items are not available or out of stock.' });
    }

    // Calculate total amount and validate variations
    let totalAmount = 0;
    for (const item of items) {
      const itemDetails = availableItems.find((i) => i._id.toString() === item.itemId);
      if (!itemDetails) {
        throw new Error(`Item not found: ${item.itemId}`);
      }

      const variation = itemDetails.variations.find(v => v._id.toString() === item.variationId);
      if (!variation || !variation.available) {
        throw new Error(`Variation not available for item: ${itemDetails.name.en}`);
      }

      item.price = variation.price;
      item.total = item.quantity * variation.price;
      totalAmount += item.total;
    }

    // Create a new order
    const newOrder = await Order.create({
      userId: req.user._id, // User ID from authentication middleware
      items,
      totalAmount,
      paymentDetails,
      deliveryInfo,
      status: 'pending',
    });

    // Create a notification for the user
    await Notification.create({
      recipient: req.user._id,
      type: 'order',
      title: 'Order Placed',
      message: `Your order #${newOrder._id} has been placed successfully.`,
    });

    // Return success response
    res.status(201).json({ success: true, data: newOrder });
  } catch (err) {
    console.error('Error placing order:', err); // Improved error logging
    handleError(res, err);
  }
};




// 2. Fetch user-specific orders
orderController.getUserOrders = async (req, res) => {
  const { startDate, endDate, page = 1, limit = 10 } = req.query;
  try {
    const query = { userId: req.user._id, isDeleted: false };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

// 3. Fetch order details by ID
orderController.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user._id, isDeleted: false });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    res.status(200).json({ success: true, data: order });
  } catch (err) {
    handleError(res, err);
  }
};

// 4. Cancel an order
orderController.cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user._id, isDeleted: false });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled.' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', timestamp: new Date() });
    await order.save();

    // Notify the user
    await Notification.create({
      recipient: req.user._id,
      type: 'order',
      title: 'Order Cancelled',
      message: `Your order #${order._id} has been cancelled.`,
    });

    res.status(200).json({ success: true, message: 'Order cancelled successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};

// ==================== ORDER STATUS AND HISTORY ====================

// 5. Update order status (Admin or staff only)
orderController.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const validStatuses = ['pending', 'confirmed', 'prepared', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });
    await order.save();

    // Log the update in the audit log
    await OrderAudit.create({
      orderId,
      adminId: req.user._id,
      action: 'Status Updated',
      details: `Order status updated to ${status}`,
    });

    // Notify the user
    await Notification.create({
      recipient: order.userId,
      type: 'order',
      title: 'Order Status Updated',
      message: `Your order #${orderId} is now ${status}.`,
    });

    res.status(200).json({ success: true, message: 'Order status updated successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};

// 6. Fetch all orders (Admin or staff only)
orderController.getAllOrders = async (req, res) => {
  const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
  try {
    const query = { isDeleted: false };
    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = orderController;
