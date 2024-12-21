/**
 * Get the current user's profile.
 * 
 * Fetches the user by the ID stored in the JWT token (req.user._id) 
 * and returns the user object without the password field.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.user._id - The authenticated user's ID.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const { handleError } = require('../../middleware/errorHandler');

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = getUserProfile;
