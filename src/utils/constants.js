// API Endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/users/login`,
  REGISTER: `${API_BASE_URL}/api/users/register`,
  ITEMS: `${API_BASE_URL}/api/items`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  PROMOTIONS: `${API_BASE_URL}/api/promotions`,
};

// App Settings
export const APP_NAME = 'Baba Jan';
export const ITEMS_PER_PAGE = 10;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};
