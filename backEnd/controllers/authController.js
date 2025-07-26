import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Validation helper
const validateInput = (fields) => {
  const errors = {};
  
  Object.keys(fields).forEach(key => {
    if (!fields[key] || fields[key].toString().trim() === '') {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    }
  });
  
  return errors;
};

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Input validation
    const validationErrors = validateInput({ name, email, password, role });
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: validationErrors 
      });
    }
    
    // Additional password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }
    
    // Create user (password will be hashed by pre-save middleware)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role
    });
    
    // Generate token
    const token = generateToken(user._id, user.role);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    const validationErrors = validateInput({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: validationErrors 
      });
    }
    
    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false,
        message: 'Account is deactivated. Please contact support.' 
      });
    }
    
    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // Generate token
    const token = generateToken(user._id, user.role);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};
