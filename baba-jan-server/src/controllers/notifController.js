const Notification = require('../models/Notification');
const User = require('../models/User');
const { handleError } = require('../middleware/errorHandler');
const notificationController = {};
const mongoose = require('mongoose');

// Get authenticated user's notifications
notificationController.getAuthenticatedUserNotifications = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Access `id` directly from `req.user`
    const userId = req.user.id || req.user._id; // Fallback to `id` if `_id` is not present
    if (!userId) {
      console.error('User ID is missing from the request.');
      return res.status(400).json({ success: false, message: 'User ID not provided.' });
    }

    console.log(`Fetching notifications for user ID: ${userId}`);
    const query = { recipient: userId };

    // Fetch notifications with pagination
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Count total notifications for pagination
    const totalNotifications = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total: totalNotifications,
        page,
        limit,
      },
    });
  } catch (err) {
    console.error('Error fetching user notifications:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};




// Get notifications for a specified user (Admin/Super Admin)
notificationController.getUserNotifications = async (req, res) => {
  const { recipientId } = req.params;
  const { page = 1, limit = 10, type } = req.query;

  try {
    const filters = { recipient: recipientId };
    if (type) filters.type = type;

    const notifications = await Notification.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Notification.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: notifications,
      pagination: { total, page, limit },
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Mark a specific notification as read
notificationController.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID.' });
    }

    // Find notification by ID
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    // Mark as read
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({ success: true, message: 'Notification marked as read.', data: notification });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
  }
};




// Mark all notifications as read for the authenticated user
notificationController.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    handleError(res, err);
  }
};
// Delete a specific notification by ID
notificationController.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID.' });
    }

    // Attempt to delete the notification
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

// Create a new notification
notificationController.createNotification = async (req, res) => {
  const { recipient, type, title, message, deliveryMethod } = req.body;

  try {
    const notificationData = {
      recipient,
      type,
      title,
      message,
      deliveryMethod,
    };

    const notification = await Notification.create(notificationData);
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = notificationController;
