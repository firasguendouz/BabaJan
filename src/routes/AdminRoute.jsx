import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ component: Component }) => {
  const { user } = useAuth();

  return user?.isAdmin ? <Component /> : <Navigate to="/" />;
};

export default AdminRoute;
