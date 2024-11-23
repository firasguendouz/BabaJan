import './Register.css';

import React from 'react';
import RegisterForm from '../components/user/RegisterForm';
import { registerUser } from '../api/userApi'; // Import the API function
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Register = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleRegister = async (formData) => {
    try {
      // Make the API call
      const response = await registerUser(formData);

      // Handle successful registration
      console.log('User registered successfully:', response.data);

      // Redirect to login page after registration
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);

      // Display user-friendly error message
      alert(error.response?.data?.message || 'An error occurred during registration.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Create an Account</h1>
        <p>Sign up to start shopping and enjoy our fresh produce.</p>
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default Register;
