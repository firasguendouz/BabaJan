import './Login.css';

import LoginForm from '../components/user/LoginForm';
import React from 'react';
import { loginUser } from '../api/userApi'; // Import the login API function
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleLogin = async (credentials) => {
    try {
      // Make the API call
      const response = await loginUser(credentials);

      // Extract user data and token from the API response
      const { user, token } = response.data;

      // Update the authentication context
      login(user, token);

      console.log('Login successful:', user);

      // Redirect to the items page
      navigate('/items');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);

      // Display user-friendly error message (optional)
      alert(error.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back!</h1>
        <p>Sign in to access your account and start shopping for fresh produce.</p>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
