import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], status: null, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
        state.status = 'success';
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default orderSlice.reducer;
