import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './apiEndpoints';

export const registerUser = (userData) =>
  axiosInstance.post(`${API_ENDPOINTS.users}/register`, userData);

export const loginUser = (credentials) =>
  axiosInstance.post(`${API_ENDPOINTS.users}/login`, credentials);

export const getUserProfile = () =>
  axiosInstance.get(`${API_ENDPOINTS.users}/profile`);

export const updateUserProfile = (profileData) =>
  axiosInstance.patch(`${API_ENDPOINTS.users}/profile`, profileData);

export const forgotPassword = (email) =>
  axiosInstance.post(`${API_ENDPOINTS.users}/forgot-password`, { email });

export const resetPassword = (data) =>
  axiosInstance.post(`${API_ENDPOINTS.users}/reset-password`, data);
