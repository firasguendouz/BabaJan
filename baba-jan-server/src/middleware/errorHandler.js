const colors = require('colors');

const errorHandler = {};

// Centralized error handling for application-level errors
errorHandler.handleError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log the error
  console.error(colors.red(`[Error] Status: ${statusCode}, Message: ${message}`));
  if (error.stack) console.error(colors.yellow(`[Stack Trace]: ${error.stack}`));

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }), // Include stack trace in development
  });
};

// Middleware for handling unhandled routes
errorHandler.notFound = (req, res) => {
  console.warn(colors.blue(`[NotFound] ${req.originalUrl} not found`));
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
};

// Global middleware for handling all Express errors
errorHandler.globalErrorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log detailed error
  console.error(colors.red(`[GlobalError] Status: ${statusCode}, URL: ${req.originalUrl}`));
  console.error(colors.yellow(`[Message]: ${message}`));
  if (err.stack) console.error(colors.grey(`[Stack]: ${err.stack}`));

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
  });
};

// Enhanced function for controlled logging of warnings
errorHandler.logWarning = (message) => {
  console.warn(colors.yellow(`[Warning] ${message}`));
};

// Enhanced function for controlled logging of info
errorHandler.logInfo = (message) => {
  console.info(colors.green(`[Info] ${message}`));
};

module.exports = errorHandler;
