const express = require('express');
const notificationController = require('../controllers/notifController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Authenticated user's routes
router.get('/', verifyToken, notificationController.getAuthenticatedUserNotifications); // Get own notifications
router.patch('/:notificationId/read', verifyToken, notificationController.markAsRead); // Mark one as read
router.patch('/read-all', verifyToken, notificationController.markAllAsRead); // Mark all as read
router.delete('/:notificationId', verifyToken, notificationController.deleteNotification);

// Admin/Super Admin routes
router.get('/user/:recipientId', verifyToken, verifyAdmin, notificationController.getUserNotifications); // Get specified user's notifications
router.post('/', verifyToken, verifyAdmin, notificationController.createNotification); // Create a notification

module.exports = router;
