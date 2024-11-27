import './AuthPage.css';

import React, { useState } from 'react';
import { loginUser, registerUser } from '../state/userSlice'; // Redux actions for login/register

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and register
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '', // For registration only
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }))
        .unwrap()
        .then(() => navigate('/'))
        .catch((err) => console.error('Login failed:', err));
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      dispatch(registerUser({ email: formData.email, password: formData.password }))
        .unwrap()
        .then(() => {
          alert('Registration successful! Please log in.');
          setIsLogin(true); // Switch to login after successful registration
        })
        .catch((err) => console.error('Registration failed:', err));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          {!isLogin && (
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            className="toggle-auth-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
