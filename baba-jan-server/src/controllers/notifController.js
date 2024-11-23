const Notification = require('../models/Notification');
const { handleError } = require('../middleware/errorHandler');
const notificationController = {};

// ==================== NOTIFICATION MANAGEMENT ====================

// 1. Create a new notification
notificationController.createNotification = async (req, res) => {
  const { recipient, type, title, message, data, deliveryMethod } = req.body;

  try {
    const newNotification = await Notification.create({
      recipient,
      type,
      title,
      message,
      data,
      deliveryMethod,
    });

    res.status(201).json({ success: true, data: newNotification });
  } catch (err) {
    handleError(res, err);
  }
};

// 2. Fetch all notifications for a user (with filters and pagination)
notificationController.getUserNotifications = async (req, res) => {
  const { type, read, page = 1, limit = 10 } = req.query;
  try {
    const query = { recipient: req.user._id };

    if (type) query.type = type;
    if (read) query.read = read === 'true';

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

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
    handleError(res, err);
  }
};

// 3. Mark a notification as read
notificationController.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    handleError(res, err);
  }
};

// 4. Mark all notifications as read for a user
notificationController.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    handleError(res, err);
  }
};

// 5. Delete a notification
notificationController.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });

    res.status(200).json({ success: true, message: 'Notification deleted successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};

// 6. Fetch unread notifications count
notificationController.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });

    res.status(200).json({ success: true, data: { unreadCount } });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = notificationController;
