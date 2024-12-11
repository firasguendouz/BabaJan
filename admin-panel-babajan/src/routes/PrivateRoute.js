import { Navigate } from 'react-router-dom';
import React from 'react';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
