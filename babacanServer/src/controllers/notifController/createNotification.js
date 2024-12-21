const Notification = require('../../models/Notification');
const { handleError } = require('../../middleware/errorHandler');

// Create a new notification
exports.createNotification = async (req, res) => {
  const { recipient, type, title, message, deliveryMethod } = req.body;

  try {
    const notificationData = { recipient, type, title, message, deliveryMethod };
    const notification = await Notification.create(notificationData);

    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    handleError(res, err);
  }
};
