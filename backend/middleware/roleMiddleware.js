// Usage: authorize('admin'), authorize('admin', 'pharmacist')
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied — requires role: ${roles.join(' or ')}`,
    });
  }
  next();
};
 
module.exports = { authorize };
 
