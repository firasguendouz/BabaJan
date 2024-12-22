const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');

// Admin Login
router.post('/login', userController.loginAdmin);

// Admin Registration (Super Admin Only)
router.post('/register', verifyToken, verifyAdmin, require('../controllers/adminController/users/registerAdmin').registerAdmin);

// User Management (Admin Only)
router.get('/users', verifyToken, verifyAdmin, adminController.getAllUsers);
router.delete('/users/:userId', verifyToken, verifyAdmin, adminController.deleteUser);
router.patch('/users/:userId', verifyToken, verifyAdmin, require('../controllers/adminController/users/updateUser').updateUser);

// Order Management (Admin Only)
router.get('/orders/:orderId', verifyToken, verifyAdmin, require('../controllers/adminController/orders/getOrderDetails').getOrderDetails);
router.get('/orders', verifyToken, verifyAdmin, adminController.getAllOrders);
router.patch('/orders/:orderId/status', verifyToken, verifyAdmin, adminController.updateOrderStatus);
router.patch('/orders/:orderId', verifyToken, verifyAdmin, orderController.updateOrder); 

// Promotion Management (Admin Only)
router.get('/promotions', verifyToken, verifyAdmin, adminController.getAllPromotions);
router.post('/promotions', verifyToken, verifyAdmin, adminController.createOrUpdatePromotion);
router.delete('/promotions/:promoId', verifyToken, verifyAdmin, adminController.deletePromotion);

// Analytics
router.get('/analytics', verifyToken, verifyAdmin, adminController.getAnalytics);

module.exports = router;
