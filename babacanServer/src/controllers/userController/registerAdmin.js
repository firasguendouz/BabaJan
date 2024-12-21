/**
 * Register a new admin user. (Super Admin only)
 * 
 * Validates the request body and ensures only a super-admin can create admin users. 
 * Hashes the password before saving the new admin user.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing admin details.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { handleError } = require('../../middleware/errorHandler');
const { validateRegistration } = require('../../utils/validators');

async function registerAdmin(req, res) {
  // Validate incoming data
  const { error } = validateRegistration(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;

    // Check if admin user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Ensure only super-admins can create admin users
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super-admins can register new admins.',
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      ...req.body,
      password: hashedPassword,
      role: 'admin', // Enforce admin role
    });

    await admin.save();
    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully.',
      data: admin,
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = registerAdmin;
