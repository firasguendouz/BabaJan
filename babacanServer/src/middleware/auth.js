const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify and decode the token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Attach user object to req.user
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized. Token is invalid or expired.' });
  }
};

// Middleware to verify super-admin privileges
exports.verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super-admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Super-admin only.' });
  }
  next();
};
