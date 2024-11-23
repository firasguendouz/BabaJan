import { API_ENDPOINTS } from './apiEndpoints';
import axiosInstance from './axiosInstance';

// Fetch all items with optional filters and pagination
export const getAllItems = (params = {}) =>
  axiosInstance.get(API_ENDPOINTS.items, { params });

// Get details of a specific item by ID
export const getItemDetails = (itemId) =>
  axiosInstance.get(`${API_ENDPOINTS.items}/${itemId}`);

// Fetch items by category with optional filters
export const getItemsByCategory = (category, params = {}) =>
  axiosInstance.get(`${API_ENDPOINTS.items}/category/${category}`, { params });

// Create a new item (Admin only)
export const createItem = (itemData) =>
  axiosInstance.post(API_ENDPOINTS.items, itemData);

// Update an existing item by ID (Admin only)
export const updateItem = (itemId, updatedData) =>
  axiosInstance.put(`${API_ENDPOINTS.items}/${itemId}`, updatedData);

// Soft delete an item by ID (Admin only)
export const deleteItem = (itemId) =>
  axiosInstance.delete(`${API_ENDPOINTS.items}/${itemId}`);

// Restore a soft-deleted item by ID (Admin only)
export const restoreItem = (itemId) =>
  axiosInstance.patch(`${API_ENDPOINTS.items}/${itemId}/restore`);
