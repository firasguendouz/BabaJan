const userControllers = require('./users');
const orderControllers = require('./orders');
const itemControllers = require('./items');
const promotionControllers = require('./promotions');
const analyticsControllers = require('./analytics');

module.exports = {
  ...userControllers,
  ...orderControllers,
  ...itemControllers,
  ...promotionControllers,
  ...analyticsControllers,
};
