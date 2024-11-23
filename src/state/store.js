import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import orderSlice from './orderSlice';
import itemSlice from './itemSlice';
import promotionSlice from './promotionSlice';
import notificationSlice from './notificationSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    orders: orderSlice,
    items: itemSlice,
    promotions: promotionSlice,
    notifications: notificationSlice,
  },
});

export default store;
