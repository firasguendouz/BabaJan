/**
 * Initiate password reset.
 * 
 * Finds a user by email, generates a reset token, and saves it. 
 * You would typically integrate an email service here to send the token.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.body.email - The user's email address.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const { handleError } = require('../../middleware/errorHandler');

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Here you would call an email service to send the resetToken
    // e.g. await emailService.sendPasswordReset(email, resetToken);

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent.',
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = forgotPassword;
