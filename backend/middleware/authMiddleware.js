const jwt = require('jsonwebtoken');
const User = require('../models/User');
 
// Verifies the JWT and attaches the logged-in user to req.user
const protect = async (req, res, next) => {
  let token;
 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
 
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ success: false, message: 'Not authorized, user inactive or not found' });
      }
 
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  }
 
  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};
 
module.exports = { protect };
 
