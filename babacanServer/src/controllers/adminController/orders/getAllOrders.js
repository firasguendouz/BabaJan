const Order = require('../../../models/Order');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Fetch all orders with filters and pagination
 * @param {Object} req - Request object containing query parameters
 * @param {Object} res - Response object
 */
exports.getAllOrders = async (req, res) => {
  const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
  try {
    const query = { isDeleted: false };

    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: { total: totalOrders, page, limit },
    });
  } catch (err) {
    handleError(res, err);
  }
};
