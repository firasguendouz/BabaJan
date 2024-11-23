import './Header.css';

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth'; // Corrected default import
import { useCart } from '../../context/CartContext'; // Import useCart for basket state
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Header = ({ title, links }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for redirection
  const { isAuthenticated, logout } = useAuth(); // Get auth state and logout function from useAuth
  const { getCartCount } = useCart(); // Get cart item count from CartContext

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAuthAction = () => {
    if (isAuthenticated()) {
      // Logout and redirect to home
      logout();
      navigate('/');
    } else {
      // Redirect to login
      navigate('/login');
    }
  };

  const handleBasketClick = () => {
    navigate('/basket'); // Navigate to the basket page
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1>{title}</h1>
      </div>
      <nav className="header-nav">
        <ul className="nav-links">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="header-actions">
          <button onClick={toggleMenu} className="menu-button">
            ☰
          </button>
          <button onClick={handleBasketClick} className="basket-button">
            🛒 Basket ({getCartCount()})
          </button>
          <button onClick={handleAuthAction} className="auth-button">
            {isAuthenticated() ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="menu-modal">
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <button onClick={toggleMenu} className="close-menu-button">
            Close
          </button>
        </div>
      )}
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Header;
