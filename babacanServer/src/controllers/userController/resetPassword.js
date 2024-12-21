/**
 * Reset user's password using a valid reset token.
 * 
 * Validates the token, ensures it hasn't expired, and updates 
 * the user's password. Then clears the token fields.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.body.token - The password reset token.
 * @param {string} req.body.newPassword - The new password.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { handleError } = require('../../middleware/errorHandler');

async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = resetPassword;
