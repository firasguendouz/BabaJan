import './Basket.css';

import { clearCart, removeFromCart } from '../state/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';

const Basket = () => {
  const cart = useSelector((state) => state.cart || []); // Fetch cart from Redux
  const dispatch = useDispatch();

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="basket-page">
      <h1>Your Basket</h1>
      {cart.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} - {item.quantity} pcs x €{item.price.toFixed(2)} per unit
                </span>
                <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
              </li>
            ))}
          </ul>
          <p>
            <strong>Total:</strong> €{getCartTotal().toFixed(2)}
          </p>
          <button onClick={() => dispatch(clearCart())}>Clear Basket</button>
        </>
      )}
    </div>
  );
};

export default Basket;
