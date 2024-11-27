import './Header.css';

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Use Redux selector for cart

const Header = ({ title, links }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart || []); // Get cart from Redux store

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBasketClick = () => {
    navigate('/basket');
  };

  const getCartItemCount = () =>
    cart.reduce((totalCount, item) => totalCount + (item.quantity || 0), 0); // Calculate total quantity

  return (
    <header className="app-header">
      <div href='/' className="header-brand">
      <a href="/" className="brand-link">
          <h1>{title}</h1>
        </a>      </div>
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
            🛒
            {getCartItemCount() > 0 && (
              <span className="item-count-badge">{getCartItemCount()}</span>
            )}
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
