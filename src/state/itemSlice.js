import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    fetchItemsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchItemsSuccess(state, action) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchItemsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchItemsStart, fetchItemsSuccess, fetchItemsFailure } = itemSlice.actions;

export default itemSlice.reducer;
