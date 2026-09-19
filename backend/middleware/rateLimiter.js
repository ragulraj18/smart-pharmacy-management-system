const rateLimit = require('express-rate-limit');

// Protects login/register from brute-force and spam-registration attacks.
// 20 attempts per 15 minutes per IP is generous for real use, tight enough
// to slow down automated abuse.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter };