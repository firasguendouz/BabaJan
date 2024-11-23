import './ItemCard.css';

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useCart } from '../../context/CartContext';

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(100); // Default to 100 grams

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= item.stock) {
      let totalPrice = 0;
      if (item.unit === 'kg') {
        // If the unit is kg, the price is per kg, so we convert price per kg to price per gram
        const pricePerGram = item.price / 1000; // Convert price per kg to price per gram
        totalPrice = pricePerGram * quantity;
      } else {
        // Handle other units if needed
        totalPrice = item.price * quantity;
      }

      // Add item to cart with price and quantity
      addToCart({ ...item, quantity, totalPrice });
      alert(`${quantity} ${item.unit} of ${item.name.en} added to your basket! Total Price: $${totalPrice.toFixed(2)}`);
    } else {
      alert('Please select a valid quantity.');
    }
  };

  return (
    <div className={`item-card ${item.stock > 0 ? '' : 'out-of-stock'}`}>
      <img src={item.imageUrl} alt={item.name.en} className="item-card-image" />
      <div className="item-card-details">
        <h3>{item.name.en}</h3>
        <p className="category">{item.category}</p>
        <p>Price per {item.unit}: ${item.price.toFixed(2)}</p>
        <p>
          Stock: {item.stock > 0 ? `${item.stock} ${item.unit}s available` : 'Out of stock'}
        </p>
        <p>Ratings: {item.ratings}⭐</p>
        {item.stock > 0 ? (
          <>
            <label htmlFor={`quantity-${item.id}`} className="quantity-label">
              Quantity (grams):
            </label>
            <input
              id={`quantity-${item.id}`}
              type="number"
              min="20"
              step="50"
              max={item.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="quantity-input"
            />
            <button onClick={handleAddToCart} className="add-to-cart-btn">
              Add to Basket
            </button>
          </>
        ) : (
          <button disabled className="out-of-stock-btn">
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.shape({
      en: PropTypes.string.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    ratings: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,  // Added unit to the prop validation
  }).isRequired,
};

export default ItemCard;
