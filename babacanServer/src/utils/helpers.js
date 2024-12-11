const helpers = {};


// Calculate final price with discount
helpers.calculateFinalPrice = (price, discount) => {
  if (discount > 0) {
    return price - (price * discount) / 100;
  }
  return price;
};

// Validate ObjectId
helpers.isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

// Pagination Utility
helpers.paginate = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(Number(limit));
};

// Hash a string (e.g., for reset tokens)
helpers.hashString = async (string) => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.hash(string, 10);
};

module.exports = helpers;
