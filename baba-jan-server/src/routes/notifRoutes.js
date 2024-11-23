const express = require('express');
const notificationController = require('../controllers/notifController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// User Routes
router.get('/', verifyToken, notificationController.getUserNotifications); // Get all notifications for a user
router.get('/unread-count', verifyToken, notificationController.getUnreadCount); // Get unread notifications count
router.patch('/:notificationId/read', verifyToken, notificationController.markAsRead); // Mark a notification as read
router.patch('/read-all', verifyToken, notificationController.markAllAsRead); // Mark all notifications as read
router.delete('/:notificationId', verifyToken, notificationController.deleteNotification); // Delete a notification

// Admin Routes
router.post('/', verifyToken, notificationController.createNotification); // Create a new notification

module.exports = router;
