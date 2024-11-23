const promoService = {};

// Validate promotion application
promoService.isApplicable = (promotion, itemId, categoryId) => {
  if (!promotion.isActive) return false;
  if (promotion.applicableTo.items && !promotion.applicableTo.items.includes(itemId)) return false;
  if (promotion.applicableTo.categories && !promotion.applicableTo.categories.includes(categoryId)) return false;
  const now = new Date();
  return now >= promotion.startDate && now <= promotion.endDate;
};

// Apply promotion to an item
promoService.applyPromotion = (item, promotion) => {
  if (!promoService.isApplicable(promotion, item._id, item.category)) return item;

  const discountedPrice =
    promotion.type === 'percentage'
      ? item.price - (item.price * promotion.discountValue) / 100
      : item.price - promotion.discountValue;

  return {
    ...item,
    discountedPrice: Math.max(discountedPrice, 0), // Ensure price is not negative
  };
};

module.exports = promoService;
