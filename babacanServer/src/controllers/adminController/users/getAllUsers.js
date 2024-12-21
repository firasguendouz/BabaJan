const User = require('../../../models/User');
const { handleError } = require('../../../middleware/errorHandler');

// Fetch all users with filters and pagination
exports.getAllUsers = async (req, res) => {
  const { role, startDate, endDate, page = 1, limit = 10 } = req.query;
  try {
    const query = { isDeleted: false };
    if (role) query.role = role;
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: { total: totalUsers, page, limit },
    });
  } catch (err) {
    handleError(res, err);
  }
};
