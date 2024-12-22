const { getAuthenticatedUserNotifications } = require('./getAuthenticatedUserNotifications');
const { markAllAsRead } = require('./markAllAsRead');
const { getUserNotifications } = require('./getUserNotifications');
const { markAsRead } = require('./markAsRead');
const { deleteNotification } = require('./deleteNotification');
const { createNotification } = require('./createNotification');
const { getUnreadCount } = require('./getUnreadCount');

module.exports = {
  getAuthenticatedUserNotifications,
  markAllAsRead,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  getUnreadCount,
  createNotification,
};
