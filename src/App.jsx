import './main.css';

import AppRoutes from './routes/AppRoutes';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import NotificationProvider from './context/NotificationContext';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  const handleBasketClick = () => {
    console.log('Basket clicked!');
    // Add logic to open cart modal or navigate to cart page
  };

  const handleLoginClick = () => {
    console.log('Login/Logout clicked!');
    // Add login/logout functionality here
  };

  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
            <div className="app">
              <Header
                title="Baba Jan"
                links={[
                  { label: 'Home', href: '/' },
                  { label: 'Shop', href: '/items' },
                  { label: 'Promotions', href: '/promotions' },
                  { label: 'Contact', href: '/contact' },
                ]}
                onBasketClick={handleBasketClick}
                onLoginClick={handleLoginClick}
                isAuthenticated={false} // Replace with actual authentication logic
              />
              <main className="app-main">
                <AppRoutes />
              </main>
              <Footer
                text="© 2024 Baba Jan. All rights reserved."
                links={[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Contact Us', href: '/contact' },
                ]}
              />
            </div>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
