import React, { useState } from 'react';

import { register } from '../state/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Dispatch registration action
    dispatch(
      register({
        name: { firstName: formData.firstName, lastName: formData.lastName },
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
    )
      .unwrap()
      .then(() => {
        alert('Registration successful!');
        navigate('/login'); // Redirect to login page
      })
      .catch((err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone (e.g., +491234567890)"
        value={formData.phone}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
