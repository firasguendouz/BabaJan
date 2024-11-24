const Item = require('../models/Item');
const validators = require('../utils/validators'); // Validation utility
const helpers = require('../utils/helpers'); // Utility functions
const { handleError } = require('../middleware/errorHandler'); // Error handler

const itemController = {};

// Create a new item
itemController.createItem = async (req, res) => {
  try {
    // Validate incoming data
    const { error } = validators.validateItem(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Ensure no unexpected fields are included
    if (req.body.variations) {
      return res.status(400).json({ success: false, message: '`variations` field is not allowed.' });
    }

    // Check for duplicate item based on unique fields if necessary (e.g., name and category)
    const duplicateItem = await Item.findOne({
      'name.en': req.body.name.en,
      category: req.body.category,
    });
    if (duplicateItem) {
      return res.status(400).json({
        success: false,
        message: `An item with the name "${req.body.name.en}" in category "${req.body.category}" already exists.`,
      });
    }

    // Create a new item
    const newItem = new Item(req.body);
    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully.',
      data: newItem,
    });
  } catch (err) {
    console.error('Error creating item:', err.message);
    handleError(res, err);
  }
};

// Get all items with filters and pagination
itemController.getAllItems = async (req, res) => {
  try {
    const { category, available, search, page = 1, limit = 10 } = req.query;

    const filters = { isDeleted: false };
    if (category) filters.category = category;
    if (available !== undefined) filters.available = available === 'true';
    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      filters.$or = [
        { 'name.en': regex },
        { 'name.de': regex },
        { category: regex },
        { 'description.en': regex },
        { 'description.de': regex },
      ];
    }

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
    console.error('Error fetching items:', err.message);
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
    console.error('Error fetching item by ID:', err.message);
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
    console.error('Error updating item:', err.message);
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
    console.error('Error deleting item:', err.message);
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
    console.error('Error restoring item:', err.message);
    handleError(res, err);
  }
};

module.exports = itemController;
