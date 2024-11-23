import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './apiEndpoints';

export const getUserNotifications = () =>
  axiosInstance.get(API_ENDPOINTS.notifications);

export const getUnreadCount = () =>
  axiosInstance.get(`${API_ENDPOINTS.notifications}/unread-count`);

export const markAsRead = (notificationId) =>
  axiosInstance.patch(`${API_ENDPOINTS.notifications}/${notificationId}/read`);

export const markAllAsRead = () =>
  axiosInstance.patch(`${API_ENDPOINTS.notifications}/read-all`);
