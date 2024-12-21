const User = require('../../../models/User');
const Notification = require('../../../models/Notification');
const { handleError } = require('../../../middleware/errorHandler');

// Soft delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.softDelete('Admin deleted user', req.adminId);
    await Notification.create({
      recipient: userId,
      type: 'system',
      title: 'Account Deleted',
      message: 'Your account has been deleted by the admin.',
    });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
};
