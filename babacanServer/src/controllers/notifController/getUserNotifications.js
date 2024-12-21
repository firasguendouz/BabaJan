const Notification = require('../../models/Notification');
const { handleError } = require('../../middleware/errorHandler');

// Get notifications for a specific user (Admin/Super Admin)
exports.getUserNotifications = async (req, res) => {
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
