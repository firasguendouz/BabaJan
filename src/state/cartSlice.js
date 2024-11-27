import { createSlice } from '@reduxjs/toolkit';

// Helper functions to interact with localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    console.error('Could not load cart from localStorage', e);
    return [];
  }
};

const saveToLocalStorage = (cart) => {
  try {
    const serializedState = JSON.stringify(cart);
    localStorage.setItem('cart', serializedState);
  } catch (e) {
    console.error('Could not save cart to localStorage', e);
  }
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: loadFromLocalStorage(), // Load initial state from localStorage
  reducers: {
    addToCart: (state, action) => {
        const existingItem = state.find((item) => item.id === action.payload.id);
        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          state.push({ ...action.payload, quantity: action.payload.quantity || 1 });
        }
      },
      
    removeFromCart: (state, action) => {
      const newState = state.filter((item) => item.id !== action.payload);
      saveToLocalStorage(newState); // Save to localStorage after removing
      return newState;
    },
    clearCart: () => {
      saveToLocalStorage([]); // Clear localStorage
      return [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
