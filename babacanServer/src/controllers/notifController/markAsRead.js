const Notification = require('../../models/Notification');
const mongoose = require('mongoose');
const { handleError } = require('../../middleware/errorHandler');

// Mark a specific notification as read
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID.' });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({ success: true, message: 'Notification marked as read.', data: notification });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
  }
};
