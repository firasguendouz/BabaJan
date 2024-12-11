const Promotion = require('../models/Promotion');
const { handleError } = require('../middleware/errorHandler'); // Error handler

const promotionController = {};

// Create a new promotion
promotionController.createPromotion = async (req, res) => {
  try {
    const promotionData = req.body;

    const newPromotion = new Promotion(promotionData);
    await newPromotion.save();

    res.status(201).json({
      success: true,
      message: 'Promotion created successfully.',
      data: newPromotion,
    });
  } catch (err) {
    console.error('Error creating promotion:', err.message);
    handleError(res, err);
  }
};

// Get all promotions
promotionController.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ priority: -1, startDate: -1 });
    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (err) {
    console.error('Error fetching promotions:', err.message);
    handleError(res, err);
  }
};

// Get active promotions
// Get active promotions
promotionController.getActivePromotions = async (req, res) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({ isActive: true, startDate: { $lte: now }, endDate: { $gte: now } })
      .sort({ priority: -1 });
    
    res.status(200).json({ success: true, data: promotions });
  } catch (err) {
    handleError(res, err);
  }
};

// Get a promotion by ID
promotionController.getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found.' });
    }

    res.status(200).json({
      success: true,
      data: promotion,
    });
  } catch (err) {
    console.error('Error fetching promotion:', err.message);
    handleError(res, err);
  }
};

// Update a promotion
promotionController.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPromotion = await Promotion.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedPromotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Promotion updated successfully.',
      data: updatedPromotion,
    });
  } catch (err) {
    console.error('Error updating promotion:', err.message);
    handleError(res, err);
  }
};

// Soft delete a promotion
promotionController.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found.' });
    }

    await promotion.softDelete(reason);

    res.status(200).json({
      success: true,
      message: 'Promotion soft deleted successfully.',
    });
  } catch (err) {
    console.error('Error soft deleting promotion:', err.message);
    handleError(res, err);
  }
};

// Restore a soft-deleted promotion
promotionController.restorePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findByIdAndUpdate(
      id,
      { isActive: true, deletedAt: null, deletedReason: null },
      { new: true }
    );

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Promotion restored successfully.',
      data: promotion,
    });
  } catch (err) {
    console.error('Error restoring promotion:', err.message);
    handleError(res, err);
  }
};

// Increment usage of a promotion
promotionController.incrementUsage = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promotion not found.' });
    }

    await promotion.incrementUsage();

    res.status(200).json({
      success: true,
      message: 'Promotion usage incremented successfully.',
      data: promotion,
    });
  } catch (err) {
    console.error('Error incrementing promotion usage:', err.message);
    handleError(res, err);
  }
};

// Find promotions by tag
promotionController.getPromotionsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    const promotions = await Promotion.findByTag(tag);
    if (!promotions.length) {
      return res.status(404).json({ success: false, message: 'No promotions found for this tag.' });
    }

    res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (err) {
    console.error('Error fetching promotions by tag:', err.message);
    handleError(res, err);
  }
};

module.exports = promotionController;
