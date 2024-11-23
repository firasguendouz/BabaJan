const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { handleError } = require('../middleware/errorHandler');
const { validateItem } = require('../utils/validators');
const itemController = {};

// ==================== ITEM MANAGEMENT ====================

// 1. Create a new item
itemController.createItem = async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    // Make sure price and unit are properly handled
    if (!req.body.unit) req.body.unit = 'kg'; // Default to kg if unit is not provided

    const newItem = await Item.create(req.body);

    // Notify admin about the new item creation
    await Notification.create({
      recipient: req.adminId,
      type: 'system',
      title: 'New Item Created',
      message: `The item "${req.body.name.en}" has been created successfully.`,
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    handleError(res, err);
  }
};

// 2. Get all items (with filters, pagination, and sorting)
itemController.getAllItems = async (req, res) => {
  const { category, available, search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
  try {
    const query = { isDeleted: false };

    if (category) query.category = category;
    if (available) query.available = available === 'true';
    if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive search

    const items = await Item.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalItems = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        total: totalItems,
        page,
        limit,
      },
    });
  } catch (err) {
    handleError(res, err);
  }
};

// 3. Get item details by ID
itemController.getItemById = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findOne({ _id: itemId, isDeleted: false });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    handleError(res, err);
  }
};

// 4. Update an item
itemController.updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { error } = validateItem(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    // Update the unit or price if necessary
    if (req.body.unit && req.body.price) {
      if (req.body.unit === 'kg') {
        // Make sure the price matches the unit, if required
        req.body.price = req.body.price; // Price per kg stays as-is
      }
      // Conversion logic can be applied if needed, for example if price per gram needs to be calculated
    }

    const updatedItem = await Item.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ success: false, message: 'Item not found.' });

    // Notify admin about the item update
    await Notification.create({
      recipient: req.adminId,
      type: 'system',
      title: 'Item Updated',
      message: `The item "${updatedItem.name.en}" has been updated successfully.`,
    });

    res.status(200).json({ success: true, data: updatedItem });
  } catch (err) {
    handleError(res, err);
  }
};

// 5. Soft delete an item
itemController.deleteItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    await item.softDelete('Admin deleted the item');

    // Notify admin about the item deletion
    await Notification.create({
      recipient: req.adminId,
      type: 'system',
      title: 'Item Deleted',
      message: `The item "${item.name.en}" has been deleted.`,
    });

    res.status(200).json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};

// 6. Toggle item availability
itemController.toggleItemAvailability = async (req, res) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    item.available = !item.available;
    await item.save();

    // Notify admin about the availability change
    await Notification.create({
      recipient: req.adminId,
      type: 'system',
      title: 'Item Availability Updated',
      message: `The availability of item "${item.name.en}" has been toggled to ${item.available ? 'available' : 'unavailable'}.`,
    });

    res.status(200).json({ success: true, data: item, message: 'Item availability updated.' });
  } catch (err) {
    handleError(res, err);
  }
};

// 7. Get items by category
itemController.getItemsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const items = await Item.find({ category, isDeleted: false });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    handleError(res, err);
  }
};

// 8. Bulk update item stock
itemController.bulkUpdateStock = async (req, res) => {
  const { updates } = req.body; // Expecting [{ itemId, stock }]
  try {
    const bulkOps = updates.map(({ itemId, stock }) => ({
      updateOne: {
        filter: { _id: itemId },
        update: { $set: { stock } },
      },
    }));

    const result = await Item.bulkWrite(bulkOps);

    res.status(200).json({ success: true, data: result, message: 'Stock updated successfully.' });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = itemController;
