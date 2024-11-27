import { Navigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
