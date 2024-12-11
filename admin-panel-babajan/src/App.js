import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard/Dashboard';
import ItemList from './pages/Items/ItemScreen';
import Login from './pages/Auth/Login';
import MainLayout from './components/common/MainLayout';
import NotificationList from './pages/Notifications/NotificationList';
import OrderList from './pages/Orders/OrderList';
import PrivateRoute from './routes/PrivateRoute';
import PromotionList from './pages/Promotions/PromotionList';
import React from 'react';
import UserList from './pages/Users/UserList';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/promotions" element={<PromotionList />} />
          <Route path="/notifications" element={<NotificationList />} />
        </Route>

        {/* Redirect to login for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
