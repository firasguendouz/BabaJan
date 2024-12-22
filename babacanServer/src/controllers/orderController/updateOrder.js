// controllers/admin/orders/updateOrder.js
const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');
const { logInfo, logError, saveOrder } = require('./utils/orderUtils');

/**
 * @function updateOrder
 * @description Update any valid field in an order.
 * @route PATCH /orders/:id
 * @param {Object} req - Express request object containing order updates in the body.
 * @param {Object} res - Express response object.
 * @returns {JSON} JSON response indicating success or failure.
 */
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    logInfo('Updating order with dynamic fields', { orderId: id, updates });

    // Validate updates (prevent malicious updates)
    const allowedFields = [
      'status',
      'subtotal',
      'shipping_price',
      'discount',
      'storage_fee',
      'events',
      'total',
      'lines',
      'shipping_address',
      'shipping_info',
      'delivery_state',
      'cancellation',
      'fees',
      'refundable',
      'report_data'
    ];

    const invalidFields = Object.keys(updates).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      logError('Invalid fields provided for update', { invalidFields });
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${invalidFields.join(', ')}`,
      });
    }

    // Fetch the order
    const order = await Order.findById(id);
    if (!order) {
      logError('Order not found for update', { orderId: id });
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Apply updates
    Object.keys(updates).forEach((field) => {
      order[field] = updates[field];
    });

    // Save order
    await saveOrder(order);

    res.status(200).json({
      success: true,
      message: 'Order updated successfully.',
      data: order,
    });
  } catch (err) {
    logError('Error updating order', { error: err.message });
    handleError(res, err);
  }
};
