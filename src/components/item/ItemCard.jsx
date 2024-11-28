import './ItemCard.css';

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { addToCart } from '../../state/cartSlice'; // Redux action
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
    <div className="product-card" aria-label={`Product: ${item.name}`}>
      {/* Thumbnail Section */}
      <div className="product-card-thumbnail">
        {item.discount && (
          <div className="product-card-discount" aria-label={`Discount: ${item.discount}%`}>
            -{item.discount}%
          </div>
        )}
        <img
          src={item.imageUrl || '/placeholder.jpg'}
          alt={item.name || 'Product'}
          className="product-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder.jpg'; // Fallback image
          }}
        />
      </div>

      {/* Content Section */}
      <div className="product-card-content">
        <h3 className="product-card-title">{item.name || 'Unknown Product'}</h3>
        <div className="product-card-pricing">
          {item.discount ? (
            <>
              <span className="product-card-price-current">
                {item.price.toFixed(2)}€
              </span>
              <span className="product-card-price-original">
                {(item.originalPrice || item.price).toFixed(2)}€
              </span>
            </>
          ) : (
            <span>{item.price.toFixed(2)}€</span>
          )}
        </div>
        <p className="product-card-unit">
          {item.price.toFixed(2)}€ / {item.unit || 'pcs'}
        </p>

        {/* Stock Control */}
        {item.stock > 0 ? (
          <div className="product-card-quantity-control">
            <label htmlFor={`quantity-${item.id}`} className="visually-hidden">
              Quantity
            </label>
            <input
              id={`quantity-${item.id}`}
              type="number"
              min="1"
              step="1"
              max={item.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="product-card-quantity-input"
              aria-label={`Quantity for ${item.name}`}
            />
            <button
              className="product-card-add-to-cart"
              onClick={handleAddToCart}
              aria-label={`Add ${quantity} ${item.unit || 'pcs'} of ${item.name} to cart`}
            >
              Add to Basket
            </button>
          </div>
        ) : (
          <div className="product-card-out-of-stock" aria-label="Out of Stock">
            Out of Stock
          </div>
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
