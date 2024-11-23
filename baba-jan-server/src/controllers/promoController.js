const Promotion = require('../models/Promotion');
const Notification = require('../models/Notification');
const { handleError } = require('../middleware/errorHandler');
const { validatePromotion } = require('../utils/validators');
const promotionController = {};

// ==================== PROMOTION MANAGEMENT ====================

// 1. Create a new promotion
promotionController.createPromotion = async (req, res) => {
  const { error } = validatePromotion(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
      // Ensure promoCode is unique or default to a generated value
      if (!req.body.promoCode) {
          req.body.promoCode = `PROMO-${Date.now()}`; // Generate a unique default promoCode
      }

      const newPromotion = await Promotion.create(req.body);

      // Notify admin about the new promotion creation
      if (req.user && req.user._id) {
          await Notification.create({
              recipient: req.user._id, // Correctly set recipient to the logged-in admin ID
              type: 'system',
              title: 'New Promotion Created',
              message: `The promotion "${req.body.title}" has been created successfully.`,
          });
      }

      res.status(201).json({ success: true, data: newPromotion });
  } catch (err) {
      handleError(res, err);
  }
};



// 2. Get all promotions (with filters, pagination, and sorting)
promotionController.getAllPromotions = async (req, res) => {
  const { isActive, search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
  try {
    const query = {};
    if (isActive) query.isActive = isActive === 'true';
    if (search) query.title = { $regex: search, $options: 'i' }; // Case-insensitive search

    const promotions = await Promotion.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalPromotions = await Promotion.countDocuments(query);

    res.status(200).json({
      success: true,
      data: promotions,
      pagination: {
        total: totalPromotions,
        page,
        limit,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

// 3. Get promotion details by ID
promotionController.getPromotionById = async (req, res) => {
  const { promoId } = req.params;
  try {
    const promotion = await Promotion.findById(promoId);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found.' });

    res.status(200).json({ success: true, data: promotion });
  } catch (err) {
    handleError(res, err);
  }
};

// 4. Update a promotion
promotionController.updatePromotion = async (req, res) => {
  const { promoId } = req.params;
  const { error } = validatePromotion(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
      const updatedPromotion = await Promotion.findByIdAndUpdate(promoId, req.body, { new: true });
      if (!updatedPromotion) return res.status(404).json({ success: false, message: 'Promotion not found.' });

      res.status(200).json({ success: true, data: updatedPromotion });
  } catch (err) {
      handleError(res, err);
  }
};


// 5. Soft delete a promotion
promotionController.deletePromotion = async (req, res) => {
  const { promoId } = req.params;

  try {
      const promotion = await Promotion.findById(promoId);
      if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found.' });

      await promotion.softDelete('Admin deleted the promotion');

      res.status(200).json({ success: true, message: 'Promotion deleted successfully.' });
  } catch (err) {
      handleError(res, err);
  }
};


// 6. Toggle promotion status
promotionController.togglePromotionStatus = async (req, res) => {
  const { promoId } = req.params;
  try {
    const promotion = await Promotion.findById(promoId);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found.' });

    promotion.isActive = !promotion.isActive;
    await promotion.save();

    // Notify admin about the status change
    await Notification.create({
      recipient: req.adminId,
      type: 'system',
      title: 'Promotion Status Updated',
      message: `The promotion "${promotion.title}" is now ${promotion.isActive ? 'active' : 'inactive'}.`,
    });

    res.status(200).json({ success: true, data: promotion, message: 'Promotion status updated.' });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = promotionController;
