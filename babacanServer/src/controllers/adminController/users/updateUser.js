const User = require('../../../models/User');
const { handleError } = require('../../../middleware/errorHandler');

// Update user details with restrictions
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Prevent unauthorized role escalation
    if (updateData.role && req.user.role !== 'super-admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Only super-admins can update user roles' });
    }

    // Prevent certain fields from being updated
    const restrictedFields = ['email', 'createdAt', 'lastLogin', 'isDeleted'];
    restrictedFields.forEach((field) => delete updateData[field]);

    // Update user fields
    if (req.body.password) {
      // Hash the password only if provided
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    Object.assign(user, updateData);
    await user.save();

    res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    handleError(res, err);
  }
};
