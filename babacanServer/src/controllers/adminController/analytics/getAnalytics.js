const User = require('../../../models/User');
const Order = require('../../../models/Order');
const Item = require('../../../models/Item');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Fetch analytics data for admin dashboard
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getAnalytics = async (req, res) => {
  try {
    // Count active users
    const userCount = await User.countDocuments({ isDeleted: false });
    
    // Count active orders
    const orderCount = await Order.countDocuments({ isDeleted: false });
    
    // Calculate total revenue from delivered orders
    const totalRevenueResult = await Order.aggregate([
      { $match: { isDeleted: false, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Count active items
    const itemCount = await Item.countDocuments({ isDeleted: false });

    res.status(200).json({
      success: true,
      data: {
        userCount,
        orderCount,
        totalRevenue,
        itemCount,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};
