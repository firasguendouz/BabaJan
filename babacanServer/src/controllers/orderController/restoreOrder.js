// controllers/admin/orders/restoreOrder.js

const Order = require('../../models/Order');
const { handleError } = require('../../middleware/errorHandler');

/**
 * @function restoreOrder
 * @description Restore a soft-deleted order by its ID.
 * @route PATCH /orders/:id/restore
 * @param {Object} req - Express request object containing order ID in params.
 * @param {Object} res - Express response object.
 * @returns {JSON} JSON response indicating success or failure.
 */
exports.restoreOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to find and restore the order
    const order = await Order.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null, deletedReason: null },
      { new: true }
    );

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order restored successfully.',
      data: order,
    });
  } catch (err) {
    console.error('Error restoring order:', err.message);
    handleError(res, err);
  }
};
