const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId, userType) => {
  return jwt.sign(
    { userId, userType },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/register-user
// @desc    Register a new user
// @access  Public
router.post('/register-user', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    const existingOrganizer = await Organizer.findOne({ email });
    
    if (existingUser || existingOrganizer) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, 'user');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: 'user'
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// @route   POST /api/auth/register-organizer
// @desc    Register a new organizer
// @access  Public
router.post('/register-organizer', [
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Business name must be between 2 and 200 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be 10 digits'),
  body('serviceType')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service type must be between 2 and 100 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { businessName, email, phone, serviceType, password } = req.body;

    // Check if organizer already exists
    const existingUser = await User.findOne({ email });
    const existingOrganizer = await Organizer.findOne({ email });
    
    if (existingUser || existingOrganizer) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email' 
      });
    }

    // Create new organizer
    const organizer = new Organizer({
      businessName,
      email,
      phone,
      serviceType,
      password
    });

    await organizer.save();

    // Generate token
    const token = generateToken(organizer._id, 'organizer');

    res.status(201).json({
      success: true,
      message: 'Organizer registered successfully',
      token,
      user: {
        id: organizer._id,
        name: organizer.businessName,
        email: organizer.email,
        phone: organizer.phone,
        serviceType: organizer.serviceType,
        userType: 'organizer'
      }
    });

  } catch (error) {
    console.error('Organizer registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or organizer
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('isOrganizer')
    .isBoolean()
    .withMessage('isOrganizer must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation errors', 
        errors: errors.array() 
      });
    }

    const { email, password, isOrganizer } = req.body;

    let user;
    let userType;

    if (isOrganizer) {
      // Look for organizer
      user = await Organizer.findOne({ email });
      userType = 'organizer';
    } else {
      // Look for regular user
      user = await User.findOne({ email });
      userType = 'user';
    }

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: `${isOrganizer ? 'Organizer' : 'User'} not found with this email` 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    // Generate token
    const token = generateToken(user._id, userType);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: isOrganizer ? user.businessName : user.name,
        email: user.email,
        phone: user.phone,
        ...(isOrganizer && { serviceType: user.serviceType }),
        userType
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;
    const userType = req.userType;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: userType === 'organizer' ? user.businessName : user.name,
        email: user.email,
        phone: user.phone,
        ...(userType === 'organizer' && { 
          serviceType: user.serviceType,
          isVerified: user.isVerified,
          rating: user.rating
        }),
        ...(userType === 'user' && { address: user.address }),
        userType
      }
    });
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;