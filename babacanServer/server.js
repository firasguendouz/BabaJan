const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/db');
const loadEnv = require('./src/config/env');
const startTelegramBot = require('./src/config/telegramBot');
const colors = require('colors');
const winston = require('winston');

// Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'server.log' })
  ]
});

// Load and Validate Environment Variables
loadEnv();
if (!process.env.PORT || !process.env.DB_URI) {
  logger.error('Missing required environment variables. Please check your configuration.');
  process.exit(1);
}

// Connect to the Database
(async () => {
  try {
    await connectDB();
    logger.info('Database connected successfully.');
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
})();

// Start Telegram Bot
(async () => {
  try {
    await startTelegramBot();
    logger.info('Telegram Bot started successfully.');
  } catch (err) {
    logger.error(`Telegram Bot error: ${err.message}`);
  }
})();

// Create HTTP Server
const server = http.createServer(app);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start the Server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.debug(err.stack);
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  logger.debug(err.stack);
  server.close(() => process.exit(1));
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  logger.warn('Shutting down gracefully...');
  try {
    // Ensure all services are closed properly
    await Promise.all([
      new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      })
      // Add other async operations here if needed
    ]);
    logger.info('Server shut down.');
    process.exit(0);
  } catch (err) {
    logger.error(`Error during shutdown: ${err.message}`);
    process.exit(1);
  }
});
