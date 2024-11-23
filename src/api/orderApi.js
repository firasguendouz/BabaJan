import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './apiEndpoints';

export const placeOrder = (orderData) =>
  axiosInstance.post(API_ENDPOINTS.orders, orderData);

export const getUserOrders = () =>
  axiosInstance.get(API_ENDPOINTS.orders);

export const getOrderDetails = (orderId) =>
  axiosInstance.get(`${API_ENDPOINTS.orders}/${orderId}`);

export const cancelOrder = (orderId) =>
  axiosInstance.patch(`${API_ENDPOINTS.orders}/${orderId}/cancel`);
