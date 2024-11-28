const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/db');
const loadEnv = require('./src/config/env');
const startTelegramBot = require('./src/config/telegramBot');
const colors = require('colors');

// Load Environment Variables
loadEnv();

// Connect to the Database
connectDB();

// Start Telegram Bot
startTelegramBot();

// Create HTTP Server
const server = http.createServer(app);

// Define PORT
const PORT = process.env.PORT || 5000;



// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(colors.red(`Uncaught Exception: ${err.message}`));
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(colors.red(`Unhandled Rejection: ${err.message}`));
  server.close(() => process.exit(1));
});
