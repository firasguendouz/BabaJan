import './ItemDetails.css';

import PropTypes from 'prop-types';
import React from 'react';

const ItemDetails = ({ item, onAddToCart }) => {
  if (!item) {
    return <p>Loading item details...</p>;
  }

  const variation = item.variations[0]; // Use the first variation
  const createdAt = new Date(item.createdAt.$date).toLocaleString();
  const updatedAt = new Date(item.updatedAt.$date).toLocaleString();

  return (
    <div className="item-details">
      <h2>{item.name.en}</h2>
      <img
        src={item.photos[0] || '/placeholder.jpg'}
        alt={item.name.en}
        className="item-image"
      />
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Unit:</strong> {item.unit}</p>
      <p><strong>Price:</strong> ${variation.price.toFixed(2)}</p>
      <p><strong>Stock:</strong> {variation.stock > 0 ? `${variation.stock} available` : 'Out of stock'}</p>
      <p><strong>Ratings:</strong> {item.ratings}⭐</p>
      <p><strong>Views:</strong> {item.views}</p>
      {item.onPromotion && <p className="promotion">🔥 On Promotion!</p>}
      <p><strong>Created At:</strong> {createdAt}</p>
      <p><strong>Updated At:</strong> {updatedAt}</p>
      <button onClick={() => onAddToCart(item._id.$oid)} disabled={!variation.available}>
        Add to Cart
      </button>
    </div>
  );
};

ItemDetails.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.object.isRequired,
    name: PropTypes.shape({
      en: PropTypes.string.isRequired,
    }).isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    variations: PropTypes.arrayOf(
      PropTypes.shape({
        price: PropTypes.number.isRequired,
        stock: PropTypes.number.isRequired,
        available: PropTypes.bool.isRequired,
      })
    ).isRequired,
    photos: PropTypes.array,
    ratings: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    onPromotion: PropTypes.bool.isRequired,
    createdAt: PropTypes.shape({
      $date: PropTypes.string.isRequired,
    }).isRequired,
    updatedAt: PropTypes.shape({
      $date: PropTypes.string.isRequired,
    }).isRequired,
  }),
  onAddToCart: PropTypes.func.isRequired,
};

export default ItemDetails;
