// controllers/admin/orders/index.js

module.exports = {
    createOrder: require('./createOrder').createOrder,
    getAllOrders: require('./getAllOrders').getAllOrders,
    getOrderById: require('./getOrderById').getOrderById,
    updateOrderStatus: require('./updateOrderStatus').updateOrderStatus,
    addOrderEvent: require('./addOrderEvent').addOrderEvent,
    deleteOrder: require('./deleteOrder').deleteOrder,
    restoreOrder: require('./restoreOrder').restoreOrder,

  };
  