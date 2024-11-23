import React from 'react';
import { useCart } from '../context/CartContext';

const Basket = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();

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
                  {item.name} - {item.quantity} grams x ${item.price.toFixed(2)} per kg
                </span>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total: ${getCartTotal().toFixed(2)}</p> {/* Show total price */}
          <button onClick={clearCart}>Clear Basket</button>
        </>
      )}
    </div>
  );
};

export default Basket;
