const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/db');
const loadEnv = require('./src/config/env');
const startTelegramBot = require('./src/config/telegramBot');
const colors = require('colors');

// Load Environment Variables
loadEnv();

// Connect to the Database
(async () => {
  try {
    await connectDB();
    console.log(colors.green('Database connected successfully.'));
  } catch (err) {
    console.error(colors.red(`Database connection error: ${err.message}`));
    process.exit(1);
  }
})();

// Start Telegram Bot
(async () => {
  try {
    await startTelegramBot();
    console.log(colors.green('Telegram Bot started successfully.'));
  } catch (err) {
    console.error(colors.red(`Telegram Bot error: ${err.message}`));
  }
})();

// Create HTTP Server
const server = http.createServer(app);

// Define PORT
const PORT = process.env.PORT || 5000;

// Start the Server
server.listen(PORT, () => {
  console.log(colors.blue(`Server running on port ${PORT}`));
});

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

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log(colors.yellow('Shutting down gracefully...'));
  server.close(() => {
    console.log(colors.yellow('Server shut down.'));
    process.exit(0);
  });
});
