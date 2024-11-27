const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify and decode the token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Token is invalid or expired.' });
  }
};

// Middleware to verify super-admin privileges
exports.verifyAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'super-admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Super-admin only.' });
  }
  next();
};
