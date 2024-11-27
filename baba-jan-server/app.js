const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv');
const { notFound, globalErrorMiddleware } = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import Routes
const itemRoutes = require('./src/routes/itemRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');
const promoRoutes = require('./src/routes/promoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const notifRoutes = require('./src/routes/notifRoutes');
const categoriesRoutes = require('./src/routes/categoriesRoutes'); // Categories route added

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors({ origin: process.env.CLIENT_URL || '*' })); // Enable CORS with client URL from .env
app.use(helmet()); // Add security headers
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common')); // Log HTTP requests based on environment

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy!' });
});

// API Routes
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/promotions', promoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/categories', categoriesRoutes); // Categories route added

// Handle Undefined Routes
app.use(notFound);

// Global Error Handler
app.use(globalErrorMiddleware);

module.exports = app;
