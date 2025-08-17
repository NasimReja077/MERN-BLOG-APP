// Backend/src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";

// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password, fullName, bio, address, mobile, aadhar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { aadhar: aadhar && aadhar }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'Email, username, or Aadhar number is already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      bio,
      address,
      mobile,
      aadhar
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
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
};

// Login user
export const login = async (req, res) => {
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
};

// Get user profile
export const getProfile = async (req, res) => {
  res.json({
    user: req.user
  });
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatar, address, mobile, aadhar } = req.body;

    // Check for Aadhar uniqueness if provided
    if (aadhar) {
      const existingUser = await User.findOne({
        aadhar,
        _id: { $ne: req.user._id }
      });
      if (existingUser) {
        return res.status(400).json({
          error: 'Aadhar number already taken'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, avatar, address, mobile, aadhar },
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
};