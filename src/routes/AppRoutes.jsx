import { Route, Routes } from 'react-router-dom';

import AdminDashboard from '../pages/AdminDashboard';
import AdminRoute from './AdminRoute';
import Basket from '../pages/Basket';
import Home from '../pages/Home';
import ItemDetailsPage from '../pages/ItemDetails';
import Items from '../pages/Items';
import Login from '../pages/Login';
import OrderDetailsPage from '../pages/OrderDetails';
import Orders from '../pages/Orders';
import PrivateRoute from './PrivateRoute';
import Profile from '../pages/Profile';
import React from 'react';
import Register from '../pages/Register';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<PrivateRoute component={Profile} />} />
      <Route path="/orders" element={<PrivateRoute component={Orders} />} />
      <Route path="/orders/:orderId" element={<PrivateRoute component={OrderDetailsPage} />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:itemId" element={<ItemDetailsPage />} />
      <Route path="/admin" element={<AdminRoute component={AdminDashboard} />} />
    </Routes>
  );
};

export default AppRoutes;
