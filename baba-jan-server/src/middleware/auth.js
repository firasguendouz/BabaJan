const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify and decode the token
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // Attach the decoded user details to the request object
    req.user = { id: decoded.id, role: decoded.role };
    console.log('User in Request:', req.user);

    next(); // Pass control to the next middleware
  } catch (err) {
    console.error('Error verifying token:', err.message);
    return res.status(401).json({ success: false, message: 'Unauthorized. Token is invalid or expired.' });
  }
};

// Middleware to verify admin or super-admin privileges
exports.verifyAdmin = async (req, res, next) => {
  try {
    // Ensure `req.user` is populated
    if (!req.user) {
      return res.status(403).json({ success: false, message: 'Access denied. User not authenticated.' });
    }

    // Log the role for debugging
    console.log('User Role:', req.user.role);

    // Allow access for both 'admin' and 'super-admin'
    if (req.user.role === 'admin' || req.user.role === 'super-admin') {
      return next(); // User is authorized
    }

    // Reject if the user does not have sufficient privileges
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  } catch (err) {
    console.error('Error in verifyAdmin:', err.message);
    return res.status(403).json({ success: false, message: 'Access denied. Invalid token or permissions.' });
  }
};
