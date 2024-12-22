import axiosInstance from './axiosInstance';

//
// ==================== AUTH ====================
//

// Admin login
export const loginAdmin = async (credentials) => {
  return axiosInstance.post('/admin/login', credentials);
};

// Register a new admin (Super Admin only)
export const registerAdmin = async (data) => {
  return axiosInstance.post('/admin/register', data);
};

//
// ==================== USERS ====================
//

// Get all users with optional filters and pagination
export const fetchUsers = async (params = {}) => {
  return axiosInstance.get('/admin/users', { params });
};

// Delete a user by ID
export const deleteUser = async (userId) => {
  return axiosInstance.delete(`/admin/users/${userId}`);
};

// Update user information by ID (Admin or Super Admin only)
export const updateUser = async (userId, updateData) => {
  return axiosInstance.patch(`/admin/users/${userId}`, updateData);
};

//
// ==================== ORDERS ====================
//

// Get all orders with optional filters and pagination
export const fetchOrders = async (params = {}) => {
  return axiosInstance.get('/admin/orders', { params });
};

// Get order details by ID
export const fetchOrderDetails = async (orderId) => {
  return axiosInstance.get(`/admin/orders/${orderId}`);
};

// Update order status by ID
export const updateOrderStatus = async (orderId, statusData) => {
  return axiosInstance.patch(`/admin/orders/${orderId}/status`, statusData);

};

// Update an order with any field by ID

export const updateOrder = async (orderId, updateData) => {
  return axiosInstance.patch(`/admin/orders/${orderId}`, updateData);
};
//
// ==================== ITEMS ====================
//

// Create a new item
export const createItem = async (categoryId, subcategoryId, data) => {
  return axiosInstance.post(`/items/${categoryId}/${subcategoryId}`, data);
};

// Get all items with optional search, filters, and pagination
export const fetchItems = async (params = {}) => {
  return axiosInstance.get('/items', { params });
};

// Update an existing item by ID
export const updateItem = async (categoryId, subcategoryId, itemId, data) => {
  return axiosInstance.patch(`/items/${categoryId}/${subcategoryId}/${itemId}`, data);
};

// Delete an item by ID
export const deleteItem = async (categoryId, subcategoryId, itemId) => {
  return axiosInstance.delete(`/items/${categoryId}/${subcategoryId}/${itemId}`);
};

//
// ==================== CATEGORIES ====================
//

// Fetch all categories
export const fetchCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data?.data || []; // Ensure it always returns an array

};

// Add a new category
export const createCategory = async (data) => {
  return axiosInstance.post('/categories', data);
};

// Update a category by ID
export const updateCategory = async (categoryId, data) => {
  return axiosInstance.patch(`/categories/${categoryId}`, data);
};

// Delete a category by ID
export const deleteCategory = async (categoryId) => {
  return axiosInstance.delete(`/categories/${categoryId}`);
};

// Add a subcategory to a category
export const addSubcategory = async (categoryId, subcategoryData) => {
  return axiosInstance.post(`/categories/${categoryId}/subcategories`, subcategoryData);
};

// Add a product to a subcategory
export const addProductToSubcategory = async (categoryId, subcategoryId, productData) => {
  return axiosInstance.post(`/categories/${categoryId}/subcategories/${subcategoryId}/products`, productData);
};

//
// ==================== PROMOTIONS ====================
//

// Create a new promotion
export const createPromotion = async (data) => {
  return axiosInstance.post('/admin/promotions', data);
};

// Fetch all promotions with optional filters and pagination
export const fetchPromotions = async (params = {}) => {
  return axiosInstance.get('/admin/promotions', { params });
};

// Update an existing promotion by ID
export const updatePromotion = async (promoId, data) => {
  return axiosInstance.patch(`/admin/promotions/${promoId}`, data);
};

// Delete a promotion by ID
export const deletePromotion = async (promoId) => {
  return axiosInstance.delete(`/admin/promotions/${promoId}`);
};

// Toggle promotion active status
export const togglePromotionStatus = async (promoId) => {
  return axiosInstance.patch(`/admin/promotions/${promoId}/status`);
};

//
// ==================== NOTIFICATIONS ====================
//

// Fetch notifications for the authenticated user
export const fetchNotifications = async (params = {}) => {
  return axiosInstance.get('/notifications', { params });
};

// Fetch unread notifications count
export const fetchUnreadCount = async () => {
  return axiosInstance.get('/notifications/unread-count');
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  return axiosInstance.patch(`/notifications/${notificationId}/read`);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  return axiosInstance.patch('/notifications/read-all');
};

// Delete a notification by ID
export const deleteNotification = async (notificationId) => {
  return axiosInstance.delete(`/notifications/${notificationId}`);
};

// Fetch notifications for a specific user (Admin Only)
export const fetchUserNotifications = async (recipientId) => {
  return axiosInstance.get(`/notifications/user/${recipientId}`);
};

// Create a new notification (Admin Only)
export const createNotification = async (data) => {
  return axiosInstance.post('/notifications', data);
};

//
// ==================== ANALYTICS ====================
//

// Fetch admin analytics data
export const fetchAnalytics = async () => {
  return axiosInstance.get('/admin/analytics');
};
