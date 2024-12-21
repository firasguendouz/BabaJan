/**
 * Admin Login
 * 
 * Validates login credentials and generates a JWT if successful.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing login credentials.
 * @param {Object} res - Express response object.
 */
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { handleError } = require('../../middleware/errorHandler');
const { validateLogin } = require('../../utils/validators');

async function loginAdmin(req, res) {
  // Validate incoming data
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;

    // Find admin by email (can be admin or super-admin)
    const admin = await User.findOne({ 
      email, 
      role: { $in: ['admin', 'super-admin'] },
    }).select('+password');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (err) {
    handleError(res, err);
  }
}

module.exports = loginAdmin;
