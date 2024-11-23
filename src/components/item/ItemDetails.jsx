import './ItemDetails.css';

import PropTypes from 'prop-types';
import React from 'react';

const ItemDetails = ({ item, onAddToCart }) => {
  if (!item) return <p>Loading item details...</p>;

  const createdAt = new Date(item.createdAt).toLocaleString();
  const updatedAt = new Date(item.updatedAt).toLocaleString();

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
      <p><strong>Price:</strong> ${item.price.toFixed(2)} per {item.unit}</p>
      <p><strong>Stock:</strong> {item.stock > 0 ? `${item.stock} available` : 'Out of stock'}</p>
      <p><strong>Ratings:</strong> {item.ratings}⭐</p>
      <p><strong>Views:</strong> {item.views}</p>
      {item.onPromotion && <p className="promotion">🔥 On Promotion!</p>}
      <p><strong>Created At:</strong> {createdAt}</p>
      <p><strong>Updated At:</strong> {updatedAt}</p>
      <button onClick={() => onAddToCart(item._id)} disabled={item.stock <= 0}>
        Add to Cart
      </button>
    </div>
  );
};

ItemDetails.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.shape({
      en: PropTypes.string.isRequired,
    }).isRequired,
    category: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    photos: PropTypes.array,
    ratings: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    onPromotion: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }),
  onAddToCart: PropTypes.func.isRequired,
};

export default ItemDetails;
