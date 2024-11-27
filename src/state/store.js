import cartReducer from './cartSlice';
import { configureStore } from '@reduxjs/toolkit';

// Load cart state from localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    console.error('Could not load cart from localStorage', e);
    return [];
  }
};

// Save cart state to localStorage
const saveToLocalStorage = (cart) => {
  try {
    const serializedState = JSON.stringify(cart);
    localStorage.setItem('cart', serializedState);
  } catch (e) {
    console.error('Could not save cart to localStorage', e);
  }
};

// Middleware to save the cart to localStorage on every state change
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  saveToLocalStorage(state.cart);
  return result;
};

// Initialize store with persisted cart
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: loadFromLocalStorage(),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
