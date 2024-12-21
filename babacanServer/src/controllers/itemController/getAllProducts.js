const Item = require('../../models/Item');
const { handleControllerError } = require('./adminUtils');

async function getAllProducts(req, res) {
  try {
    const products = await Item.find();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    handleControllerError(res, err);
  }
}

module.exports = getAllProducts;
