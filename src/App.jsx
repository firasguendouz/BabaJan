import './main.css';

import AppRoutes from './routes/AppRoutes';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header
          title="BabaCan"
          links={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/items' },
            { label: 'Contact', href: '/contact' },
          ]}
        />
        <main className="app-main">
          <AppRoutes />
        </main>
        <Footer
          text="© 2024 BabaCan . All rights reserved."
          links={[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Contact Us', href: '/contact' },
          ]}
        />
      </div>
    </Router>
  );
};

export default App;
