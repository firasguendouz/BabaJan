import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './apiEndpoints';

export const getAllItems = () =>
  axiosInstance.get(API_ENDPOINTS.items);

export const getItemDetails = (itemId) =>
  axiosInstance.get(`${API_ENDPOINTS.items}/${itemId}`);

export const getItemsByCategory = (category) =>
  axiosInstance.get(`${API_ENDPOINTS.items}/category/${category}`);
