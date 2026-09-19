const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =====================================================
// GENERATE JWT TOKEN
// =====================================================

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// =====================================================
// REGISTER USER
// POST /api/auth/register
// =====================================================

const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      role,
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    // Only customers can register publicly
    const safeRole = 'customer';

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone,
      address,
      role: safeRole,
    });

    // Generate token
    const token = generateToken(user._id);

    // Response
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// LOGIN USER
// POST /api/auth/login
// =====================================================

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user including password
    const user = await User.findOne({
      email: normalizedEmail,
    }).select('+password');

    // Check credentials
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

const getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  getMe,
};