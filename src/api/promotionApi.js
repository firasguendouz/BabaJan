import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from './apiEndpoints';

export const getAllPromotions = () =>
  axiosInstance.get(API_ENDPOINTS.promotions);

export const createPromotion = (promotionData) =>
  axiosInstance.post(API_ENDPOINTS.promotions, promotionData);

export const togglePromotionStatus = (promoId) =>
  axiosInstance.patch(`${API_ENDPOINTS.promotions}/${promoId}/status`);
