/**
 * User Login (with rate-limiting).
 * 
 * Checks if the user exists and if the account is locked. 
 * Increments login attempts on failure or resets them on success. 
 * Generates a JWT upon successful login.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing login credentials.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { handleError } = require('../../middleware/errorHandler');

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(403).json({
        success: false,
        message: 'Account is locked. Try again later.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;

      // Lock account after 5 attempts
      if (user.loginAttempts >= 5) {
        await user.lockAccount();
      }
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Reset login attempts on success
    user.loginAttempts = 0;
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = loginUser;
