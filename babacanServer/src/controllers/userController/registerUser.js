/**
 * Register a new regular user.
 * 
 * Validates the request body, checks for an existing user by email, 
 * then hashes the password and saves the new user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { handleError } = require('../../middleware/errorHandler');
const { validateRegistration } = require('../../utils/validators');

async function registerUser(req, res) {
  // Validate incoming data
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const { email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      ...req.body,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if not specified
    });

    await user.save();
    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = registerUser;
