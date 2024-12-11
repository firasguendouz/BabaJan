const colors = require('colors');

const errorHandler = {};

errorHandler.handleError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  console.error(colors.red(`[Error] Status: ${statusCode}, Message: ${message}`));
  res.status(statusCode).json({ success: false, message });
};

errorHandler.notFound = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
};

errorHandler.globalErrorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(colors.red(`[Error] ${message}`));
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
