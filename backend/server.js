const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Import models
const User = require('./models/User');
const Organizer = require('./models/Organizer');
const Event = require('./models/Event');

// Import routes
app.use('/api/organizer', require('./routes/organizer'));
app.use('/api/user', require('./routes/user'));

// JWT Token generator
const signToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// User Registration
app.post('/api/auth/register/user', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log('Received registration data:', req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists with this email' 
      });
    }

    // Create new user in MongoDB
    const newUser = await User.create({
      name,
      email,
      phone,
      password
    });

    console.log('New user created in MongoDB:', newUser);

    // Generate JWT token
    const token = signToken(newUser._id, 'user');

    // Return success response
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          type: 'user'
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists with this email' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        status: 'error',
        message: messages.join(', ') 
      });
    }
    
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Organizer Registration
app.post('/api/auth/register/organizer', async (req, res) => {
  try {
    const { businessName, email, phone, serviceType, password } = req.body;

    console.log('Received organizer registration data:', req.body);

    // Check if organizer already exists
    const existingOrganizer = await Organizer.findOne({ email });
    if (existingOrganizer) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Organizer already exists with this email' 
      });
    }

    // Create new organizer in MongoDB
    const newOrganizer = await Organizer.create({
      businessName,
      email,
      phone,
      serviceType,
      password
    });

    console.log('New organizer created in MongoDB:', newOrganizer);

    // Generate JWT token
    const token = signToken(newOrganizer._id, 'organizer');

    // Return success response
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newOrganizer._id,
          name: newOrganizer.businessName,
          email: newOrganizer.email,
          type: 'organizer'
        }
      }
    });

  } catch (error) {
    console.error('Organizer registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Organizer already exists with this email' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        status: 'error',
        message: messages.join(', ') 
      });
    }
    
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, isOrganizer } = req.body;

    console.log('Login attempt:', { email, isOrganizer });

    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide email and password' 
      });
    }

    // Find user in MongoDB based on type
    let user;
    if (isOrganizer) {
      user = await Organizer.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    // Check if user exists
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ 
        status: 'error',
        message: 'Incorrect email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ 
        status: 'error',
        message: 'Incorrect email or password' 
      });
    }

    console.log('Login successful for user:', email);

    // Generate JWT token
    const token = signToken(user._id, isOrganizer ? 'organizer' : 'user');

    res.json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name || user.businessName,
          email: user.email,
          type: isOrganizer ? 'organizer' : 'user'
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Get all users (for testing)
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const organizers = await Organizer.find().select('-password');
    
    res.json({
      users: users,
      organizers: organizers
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// Basic route to test API
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Eventify API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});