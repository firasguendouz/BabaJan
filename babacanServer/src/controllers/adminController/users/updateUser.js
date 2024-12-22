const User = require('../../../models/User');
const bcrypt = require('bcryptjs');

// Update User Information
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent unauthorized role updates
    if (updateData.role && req.user.role !== 'super-admin') {
      return res.status(403).json({ success: false, message: 'Only Super Admins can update user roles.' });
    }

    // Prevent critical fields from being updated
    const restrictedFields = ['email', 'createdAt', 'lastLogin', 'isDeleted'];
    restrictedFields.forEach(field => delete updateData[field]);

    // Update password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    await user.save();

    res.status(200).json({ success: true, message: 'User updated successfully.', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to update user information.' });
  }
};
