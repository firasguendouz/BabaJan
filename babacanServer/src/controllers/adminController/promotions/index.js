const { getAllPromotions } = require('./getAllPromotions');
const { createOrUpdatePromotion } = require('./createOrUpdatePromotion');
const { deletePromotion } = require('./deletePromotion');

/**
 * Promotion Management Module
 * Exports all promotion-related controller functions
 */
module.exports = {
  getAllPromotions,
  createOrUpdatePromotion,
  deletePromotion,
};
