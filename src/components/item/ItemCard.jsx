import './ItemCard.css';

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { addToCart } from '../../state/cartSlice'; // Import the Redux action
import { useDispatch } from 'react-redux';

const ItemCard = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= item.stock) {
      const totalPrice =
        item.unit === 'kg'
          ? (item.price / 1000) * quantity
          : item.price * quantity;

      dispatch(addToCart({ ...item, quantity, totalPrice }));
      alert(
        `${quantity} ${item.unit || 'pcs'} of ${item.name} added! Total Price: €${totalPrice.toFixed(
          2
        )}`
      );
    } else {
      alert('Please enter a valid quantity within stock limits.');
    }
  };

  return (
    <div className="product-card">
      <div className="product-card-thumbnail">
        {item.discount && <div className="product-card-discount">-{item.discount}%</div>}
        <img
          src={item.imageUrl || '/placeholder.jpg'}
          alt={item.name || 'Product'}
          title={item.name || 'Product'}
          className="product-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder.jpg'; // Fallback image
          }}
        />
      </div>
      <div className="product-card-content">
        <p className="product-card-title">{item.name || 'Unknown Product'}</p>
        <p className="product-card-price">
          {item.discount ? (
            <>
              <span className="product-card-price-current">{item.price.toFixed(2)}€</span>
              <span className="product-card-price-original">
                {(item.originalPrice || item.price).toFixed(2)}€
              </span>
            </>
          ) : (
            <span>{item.price.toFixed(2)}€</span>
          )}
        </p>
        <p className="product-card-unit">
          {item.price.toFixed(2)}€ / {item.unit || 'pcs'}
        </p>
        {item.stock > 0 ? (
          <div className="product-card-quantity-control">
            <input
              type="number"
              min="1"
              step="1"
              max={item.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="product-card-quantity-input"
            />
            <button className="product-card-add-to-cart" onClick={handleAddToCart}>
              Add to Basket
            </button>
          </div>
        ) : (
          <div className="product-card-out-of-stock">Out of Stock</div>
        )}
      </div>
    </div>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    stock: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    discount: PropTypes.number,
    unit: PropTypes.string,
  }).isRequired,
};

export default ItemCard;
