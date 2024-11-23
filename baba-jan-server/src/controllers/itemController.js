const Item = require('../models/Item');
const validators = require('../utils/validators'); // For validating input data
const helpers = require('../utils/helpers'); // For utility functions
const { handleError } = require('../middleware/errorHandler'); // Centralized error handling

const itemController = {};

// Create a new item
itemController.createItem = async (req, res) => {
  try {
    const { error } = validators.validateItem(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const newItem = new Item(req.body);
    await newItem.save();

    res.status(201).json({ success: true, message: 'Item created successfully.', data: newItem });
  } catch (err) {
    handleError(res, err);
  }
};

// Get all items with optional filters and pagination
itemController.getAllItems = async (req, res) => {
  try {
    const { category, available, page = 1, limit = 10 } = req.query;

    const filters = { isDeleted: false };
    if (category) filters.category = category;
    if (available !== undefined) filters.available = available === 'true';

    let query = Item.find(filters);
    query = helpers.paginate(query, page, limit);

    const items = await query.exec();
    const totalCount = await Item.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: items,
      meta: { total: totalCount, page, limit },
    });
  } catch (err) {
    handleError(res, err);
  }
};

// Get a single item by ID
itemController.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!helpers.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid item ID.' });
    }

    const item = await Item.findById(id);
    if (!item || item.isDeleted) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    handleError(res, err);
  }
};

// Update an existing item
itemController.updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!helpers.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid item ID.' });
    }

    const { error } = validators.validateItem(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedItem || updatedItem.isDeleted) {
      return res.status(404).json({ success: false, message: 'Item not found or deleted.' });
    }

    res.status(200).json({ success: true, message: 'Item updated successfully.', data: updatedItem });
  } catch (err) {
    handleError(res, err);
  }
};

// Soft delete an item
itemController.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!helpers.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid item ID.' });
    }

    const item = await Item.findById(id);
    if (!item || item.isDeleted) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    await item.softDelete();
    res.status(200).json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};

// Restore a soft-deleted item
itemController.restoreItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!helpers.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid item ID.' });
    }

    const item = await Item.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    res.status(200).json({ success: true, message: 'Item restored successfully.', data: item });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = itemController;
