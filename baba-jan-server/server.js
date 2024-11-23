const http = require('http');
const app = require('./app');
const connectDB = require('./src/config/db');
const loadEnv = require('./src/config/env');
const startTelegramBot = require('./src/config/telegramBot');
const colors = require('colors');
const ngrok = require('ngrok');

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

// Start the server and expose it via ngrok
server.listen(PORT, async () => {
  console.log(colors.green(`Server is running on http://localhost:${PORT}`));
  console.log(colors.cyan(`Environment: ${process.env.NODE_ENV || 'development'}`));

  // Expose the local server through ngrok for remote access
  try {
    const url = await ngrok.connect(PORT);
    console.log(colors.magenta(`Ngrok is forwarding to: ${url}`));
  } catch (err) {
    console.error(colors.red('Error starting ngrok:', err));
  }
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
