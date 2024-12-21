/**
 * Index file to export all promotion controllers.
 * 
 * Import each controller function and export them as 
 * named properties for easy import elsewhere in the app.
 */

const createPromotion = require('./createPromotion');
const getAllPromotions = require('./getAllPromotions');
const getActivePromotions = require('./getActivePromotions');
const getPromotionById = require('./getPromotionById');
const updatePromotion = require('./updatePromotion');
const deletePromotion = require('./deletePromotion');
const restorePromotion = require('./restorePromotion');
const incrementUsage = require('./incrementUsage');
const getPromotionsByTag = require('./getPromotionsByTag');

module.exports = {
  createPromotion,
  getAllPromotions,
  getActivePromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  restorePromotion,
  incrementUsage,
  getPromotionsByTag,
};
