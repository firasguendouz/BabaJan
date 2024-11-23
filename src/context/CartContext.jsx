import React, { createContext, useContext, useState } from 'react';

import PropTypes from 'prop-types';

// Create CartContext
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  // Get the total count of distinct items in the cart (not the total quantity)
  const getCartCount = () => cart.length;

  // Calculate the total price (convert grams to kg for pricing)
  const getCartTotal = () =>
    cart.reduce((total, item) => {
      // price per gram (price per kg / 1000)
      const pricePerGram = item.price / 1000;
      return total + item.quantity * pricePerGram; // Total price for the selected grams
    }, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, getCartCount, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
