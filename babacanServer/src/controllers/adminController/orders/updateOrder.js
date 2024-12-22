const Order = require('../../../models/Order');
const OrderAudit = require('../../../models/OrderAudit');
const Notification = require('../../../models/Notification');
const { handleError } = require('../../../middleware/errorHandler');

/**
 * Update order details and log the changes
 * @param {Object} req - Request object containing order details
 * @param {Object} res - Response object
 */
exports.updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;

  try {
    // Fetch the existing order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    

    // Track changes for auditing
    const changes = {};
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && JSON.stringify(order[key]) !== JSON.stringify(updateData[key])) {
        changes[key] = {
          old: order[key],
          new: updateData[key],
        };
        order[key] = updateData[key];
      }
    });

    // Update status history if the status is changed
    if (updateData.status && updateData.status !== order.status) {
      order.statusHistory.push({ status: updateData.status, timestamp: new Date() });
    }

    // Save the updated order
    await order.save();

    // Log the audit trail with correct enum value
    await OrderAudit.create({
      orderId,
      adminId: req.adminId, // Ensure this field is populated correctly
      action: 'Updated', // Use a valid enum value
      details: `Order fields updated: ${Object.keys(changes).join(', ')}`,
      changes,
    });

    // Send notification if relevant fields are updated
    if (updateData.status || updateData.deliveryInfo || updateData.paymentDetails) {
      await Notification.create({
        recipient: order.userId,
        type: 'order',
        title: 'Order Updated',
        message: `Your order #${orderId} has been updated.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error('Validation Error:', err.message);
      return res.status(400).json({
        success: false,
        message: `Validation Error: ${err.message}`,
        details: err.errors,
      });
    }

    console.error('Error updating order:', err.message);
    handleError(res, err);
  }
};
