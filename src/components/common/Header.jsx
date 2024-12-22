import './Header.css';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';
import { logout } from '../../state/userSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand Section */}
        <div className="header-brand">
          <Link to="/" aria-label="Home">
            <h1>BabaCan Market</h1>
          </Link>
        </div>

        {/* Navigation Section */}
        <nav className="header-nav">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/items">Shop</Link>
            </li>
            <li>
              <Link to="/basket">Basket</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button
                    className="logout-button"
                    onClick={handleLogout}
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Responsive Menu for Mobile */}
        <div className="header-menu-toggle">
          <button
            aria-label="Toggle navigation menu"
            className="menu-button"
            onClick={() => document.body.classList.toggle('menu-open')}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
