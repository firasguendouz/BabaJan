import './Basket.css';

import { clearCart, removeFromCart } from '../state/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Basket = () => {
  const cart = useSelector((state) => state.cart || []);
  const user = useSelector((state) => state.user); // Assuming user state contains login info
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.quantity * item.price, 0);

  const handlePaymentRedirect = () => {
    if (user && user.isAuthenticated) {
      navigate('/payment'); // Redirect to payment page
    } else {
      navigate('/auth/login'); // Redirect to login page
    }
  };

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
          <div className="basket-actions">
            <button onClick={() => dispatch(clearCart())}>Clear Basket</button>
            <button onClick={handlePaymentRedirect} className="payment-button">
              Go to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Basket;
