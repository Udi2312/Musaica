
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // ADD THIS LINE

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  // No token? Let the controller handle email/password auth
  if (!token) {
    console.log('No token found - proceeding to controller authentication');
    return next();  // Changed from returning error
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);
    if (!user) throw new Error('User not found');
    req.user = user;
    console.log(`Token Auth: ${user.username} (${user.email})`);
    next();
  } catch (err) {
    console.error('Token Verification Error:', err.message);
    res.status(401).json({ 
      error: 'Invalid token',
      details: err.message 
    });
  }
};