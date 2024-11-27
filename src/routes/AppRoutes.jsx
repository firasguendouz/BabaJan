import { Route, Routes } from 'react-router-dom';

import Basket from '../pages/Basket';
import Home from '../pages/Home';
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
      <Route path="/register" element={<Register />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/items" element={<Items />} />
      <Route path="/profile" element={<PrivateRoute component={Profile} />} />
      <Route path="/orders" element={<PrivateRoute component={Orders} />} />
      <Route path="/orders/:orderId" element={<PrivateRoute component={OrderDetailsPage} />} />
    </Routes>
  );
};

export default AppRoutes;
