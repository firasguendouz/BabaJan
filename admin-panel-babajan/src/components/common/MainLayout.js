import './MainLayout.css';

import { FaBell, FaBox, FaClipboardList, FaTag, FaUser } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

import React from 'react';

const MainLayout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <Link to="/users"><FaUser /> Users</Link>
            </li>
            <li>
              <Link to="/orders"><FaClipboardList /> Orders</Link>
            </li>
            <li>
              <Link to="/items"><FaBox /> Items</Link>
            </li>
            <li>
              <Link to="/promotions"><FaTag /> Promotions</Link>
            </li>
            <li>
              <Link to="/notifications"><FaBell /> Notifications</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <header className="header">
          <h1>Admin Dashboard</h1>
        </header>
        <div className="main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
