const Notification = require('../../models/Notification');
const mongoose = require('mongoose');
const { handleError } = require('../../middleware/errorHandler');

// Delete a specific notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID.' });
    }

    const deletedNotification = await Notification.findByIdAndDelete(notificationId);
    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully.',
      data: deletedNotification,
    });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ success: false, message: 'Failed to delete notification.' });
  }
};
