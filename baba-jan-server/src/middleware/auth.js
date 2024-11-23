const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID from the token to the request object
    req.user = { _id: decoded.id };

    // Optional: Fetch the user details from the database (if needed)
    // const user = await User.findById(decoded.id).select('_id email name role');
    // if (!user) {
    //   return res.status(401).json({ success: false, message: 'Unauthorized. User not found.' });
    // }
    // req.user = user;

    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error('Error verifying token:', err.message);
    return res.status(403).json({ success: false, message: 'Token is invalid.' });
  }
};

exports.verifyAdmin = async (req, res, next) => {
  try {
    // Extract and decode the token
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(403).json({ success: false, message: 'Access denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Fetch the user from the database
    const user = await User.findById(req.user.id);
    if (!user) return res.status(403).json({ success: false, message: 'Access denied. User not found.' });

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Access denied. Invalid token.' });
  }
};

