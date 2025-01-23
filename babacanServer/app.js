const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { notFound, globalErrorMiddleware } = require('./src/middleware/errorHandler');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.CLIENT_URL) {
  console.error(colors.red('Missing required CLIENT_URL environment variable. Exiting...'));
  process.exit(1);
}

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

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Enable CORS with client URL from .env
app.use(helmet()); // Add security headers
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common')); // Log HTTP requests based on environment

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy!',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
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
