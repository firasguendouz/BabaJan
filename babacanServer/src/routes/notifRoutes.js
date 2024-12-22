const express = require('express');
const notificationController = require('../controllers/notifController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, notificationController.getAuthenticatedUserNotifications);
router.patch('/:notificationId/read', verifyToken, notificationController.markAsRead);
router.patch('/read-all', verifyToken, notificationController.markAllAsRead);
router.delete('/:notificationId', verifyToken, notificationController.deleteNotification);
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);

// Admin-only Routes
router.get('/user/:recipientId', verifyToken, verifyAdmin, notificationController.getUserNotifications);
router.post('/', verifyToken, verifyAdmin, notificationController.createNotification);

module.exports = router;
