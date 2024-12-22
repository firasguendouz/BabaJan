const { getAllOrders } = require('./getAllOrders');
const { updateOrderStatus } = require('./updateOrderStatus');
const { getOrderDetails } = require('./getOrderDetails');
const { deleteOrder } = require('./deleteOrder');
const { updateOrder } = require('./updateOrder');

/**
 * Order Management Module
 * Exports all order-related controller functions
 */
module.exports = {
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
  updateOrder,
  deleteOrder,
};
