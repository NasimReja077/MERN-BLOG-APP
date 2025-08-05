// Backend/src/routes/auth.route.js 
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { auth } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
// const { validate, schemas } = require('../middleware/validation');
const router = express.Router();

// Register user
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { username, email, password, fullName, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'Email or username is already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      bio
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Login user
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  res.json({
    user: req.user
  });
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      error: 'Profile update failed',
      message: error.message
    });
  }
});


export default router;