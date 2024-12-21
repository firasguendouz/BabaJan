/**
 * Fetch all users (Admin only).
 * 
 * Supports optional role filter and pagination via query parameters. 
 * Excludes password field in the returned data.
 *
 * @param {Object} req - Express request object.
 * @param {string} [req.query.role] - Optional role to filter users.
 * @param {number} [req.query.page=1] - Page number for pagination.
 * @param {number} [req.query.limit=10] - Maximum users per page.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const { handleError } = require('../../middleware/errorHandler');

async function getAllUsers(req, res) {
  const { role, page = 1, limit = 10 } = req.query;

  try {
    const query = { isDeleted: false };
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-password');

    const totalUsers = await User.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: totalUsers,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = getAllUsers;
