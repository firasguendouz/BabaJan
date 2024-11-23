import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  promotions: [],
  loading: false,
  error: null,
};

const promotionSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    fetchPromotionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPromotionsSuccess(state, action) {
      state.promotions = action.payload;
      state.loading = false;
    },
    fetchPromotionsFailure(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchPromotionsStart,
  fetchPromotionsSuccess,
  fetchPromotionsFailure,
} = promotionSlice.actions;

export default promotionSlice.reducer;
