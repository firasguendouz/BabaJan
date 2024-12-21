const Notification = require('../../models/Notification');
const { handleError } = require('../../middleware/errorHandler');

// Get authenticated user's notifications
exports.getAuthenticatedUserNotifications = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const userId = req.user.id || req.user._id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID not provided.' });
    }

    const query = { recipient: userId };
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
        currentPage: page,
        totalPages: Math.ceil(totalNotifications / limit),
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};
