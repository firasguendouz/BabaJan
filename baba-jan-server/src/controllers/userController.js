const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { handleError } = require('../middleware/errorHandler');
const { validateRegistration, validateLogin, validatePasswordReset } = require('../utils/validators');
const userController = {};

// ==================== USER MANAGEMENT ====================
// Admin Registration (Super Admin only)
userController.registerAdmin = async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const { email, phone, password } = req.body;

    // Check if admin user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Ensure only super-admins can create admin users
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ success: false, message: 'Only super-admins can register new admins.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      ...req.body,
      password: hashedPassword,
      role: 'admin', // Enforce admin role
    });

    await admin.save();
    res.status(201).json({ success: true, message: 'Admin registered successfully.', data: admin });
  } catch (err) {
    handleError(res, err);
  }
};

// Admin Login
userController.loginAdmin = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await User.findOne({ email, role: { $in: ['admin', 'super-admin'] } }).select('+password');
    if (!admin) return res.status(404).json({ success: false, message: 'Invalid email or password.' });

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Generate JWT
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token, user: { id: admin._id, email: admin.email, role: admin.role } });
  } catch (err) {
    handleError(res, err);
  }
};
// 1. Register a new user
userController.registerUser = async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const { email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);  // Generate salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password

    const user = new User({
      ...req.body,
      password: hashedPassword, // Save hashed password
      role: role || 'user', // Default role is 'user' unless specified
    });

    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    handleError(res, err);
  }
};
  

// 2. User login
userController.loginUser = async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const { email, password } = req.body;

    // Find user by email, select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'Invalid email or password.' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token, user });
  } catch (err) {
    handleError(res, err);
  }
};
// 3. Get user profile
userController.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    handleError(res, err);
  }
};

// 4. Update user profile
userController.updateUserProfile  = async (req, res) => {
  const { userId } = req.params;
  console.log('Received userId:', userId);

  try {
    // Log the query result
    const user = await User.findById(userId);
    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Proceed with updates
    Object.assign(user, req.body);
    await user.save();

    res.status(200).json({ success: true, message: 'User updated successfully.', data: user });
  } catch (err) {
    console.error('Error finding or updating user:', err.message);
    res.status(500).json({ success: false, message: 'An error occurred.' });
  }
};

// ==================== PASSWORD MANAGEMENT ====================

// 5. Initiate password reset
userController.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email (integration with email service needed)
    // e.g., await emailService.sendPasswordReset(email, resetToken);

    res.status(200).json({ success: true, message: 'Password reset email sent.' });
  } catch (err) {
    handleError(res, err);
  }
};

// 6. Reset password
userController.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};

// ==================== ADMIN ACTIONS ====================

// 7. Admin fetch all users
userController.getAllUsers = async (req, res) => {
  const { role, page = 1, limit = 10 } = req.query;

  try {
    const query = { isDeleted: false };
    if (role) query.role = role;

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-password');

    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: totalUsers,
        page,
        limit,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = userController;
