const User = require('../models/User');
const Order = require('../models/Order');
const Item = require('../models/Item');
const Promotion = require('../models/Promotion');
const Notification = require('../models/Notification');
const OrderAudit = require('../models/OrderAudit');
const { handleError } = require('../middleware/errorHandler');
const { validateItem, validatePromotion } = require('../utils/validators');
const adminController = {};

// ==================== USER MANAGEMENT ====================

// 1. Fetch all users (with filters and pagination)
adminController.getAllUsers = async (req, res) => {
  const { role, startDate, endDate, page = 1, limit = 10 } = req.query;
  try {
    const query = { isDeleted: false };
    if (role) query.role = role;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: totalUsers,
        page,
        limit,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

// 2. Soft delete a user
adminController.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.softDelete('Admin deleted user', req.adminId);
    res.status(200).json({ success: true, message: 'User deleted successfully' });

    // Send notification to the user
    await Notification.create({
      recipient: userId,
      type: 'system',
      title: 'Account Deleted',
      message: 'Your account has been deleted by the admin.',
    });
  } catch (err) {
    handleError(res, err);
  }
};

// ==================== ORDER MANAGEMENT ====================

// 3. Fetch all orders (with filters and pagination)
adminController.getAllOrders = async (req, res) => {
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

// 4. Update order status with audit logs
adminController.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date() });
    await order.save();

    // Log the update in the audit log
    await OrderAudit.create({
      orderId,
      adminId: req.adminId,
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

    res.status(200).json({ success: true, message: 'Order status updated successfully' });
  } catch (err) {
    handleError(res, err);
  }
};

// ==================== ITEM MANAGEMENT ====================

// 5. Manage items (CRUD)
adminController.createItem = async (req, res) => {
  console.log('Incoming Item Data:', req.body);
  const { error } = validateItem(req.body);
  if (error) {
      console.error('Validation Error:', error.details[0].message);
      return res.status(400).json({ success: false, message: error.details[0].message });
  }
  
  // Ensure price and quantity are handled properly based on unit (e.g., per kg or per piece)
  if (req.body.unit === 'kg' && req.body.price) {
    // Convert price if necessary (assuming price is per kg and user chooses per gram or other units)
    req.body.price = req.body.price / 1000; // Adjust for grams or other unit conversions as necessary
  }

  try {
      const newItem = await Item.create(req.body);
      res.status(201).json({ success: true, data: newItem });
  } catch (err) {
      console.error('Database Error:', err.message);
      handleError(res, err);
  }
};

adminController.updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { error } = validateItem(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  // Ensure price and quantity are handled properly based on unit (e.g., per kg or per piece)
  if (req.body.unit === 'kg' && req.body.price) {
    // Convert price if necessary (assuming price is per kg and user chooses per gram or other units)
    req.body.price = req.body.price / 1000; // Adjust for grams or other unit conversions as necessary
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ success: false, message: 'Item not found' });

    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) {
    handleError(res, err);
  }
};

adminController.deleteItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    await item.softDelete();
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};

// ==================== PROMOTION MANAGEMENT ====================

// 6. Get all promotions
adminController.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findActive();
    res.status(200).json({ success: true, data: promotions });
  } catch (err) {
    handleError(res, err);
  }
};

// 7. Create or update promotion
adminController.createOrUpdatePromotion = async (req, res) => {
  const { promoId } = req.body;
  const { error } = validatePromotion(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    let promotion;
    if (promoId) {
      promotion = await Promotion.findByIdAndUpdate(promoId, req.body, { new: true });
      if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
    } else {
      promotion = await Promotion.create(req.body);
    }
    res.status(201).json({ success: true, data: promotion });
  } catch (err) {
    handleError(res, err);
  }
};

// 8. Soft delete promotion
adminController.deletePromotion = async (req, res) => {
  const { promoId } = req.params;
  try {
    const promotion = await Promotion.findById(promoId);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });

    await promotion.softDelete('Admin deleted promotion');
    res.status(200).json({ success: true, message: 'Promotion deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};

// ==================== ANALYTICS ====================

// 9. Fetch analytics
adminController.getAnalytics = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ isDeleted: false });
    const orderCount = await Order.countDocuments({ isDeleted: false });
    const totalRevenue = await Order.aggregate([
      { $match: { isDeleted: false, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);

    const itemCount = await Item.countDocuments({ isDeleted: false });

    res.status(200).json({
      success: true,
      data: {
        userCount,
        orderCount,
        totalRevenue: totalRevenue[0]?.total || 0,
        itemCount,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = adminController;
