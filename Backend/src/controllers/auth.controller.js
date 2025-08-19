// Backend/src/controllers/auth.controller.js
import { User } from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js"

// Register user
export const register = async (req, res) => {

  try {
    const { username, email, password, fullName, bio, address, mobile, aadhar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { aadhar: aadhar && aadhar }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'Email, username, or Aadhar number is already taken'
      });
    }

    // Create new user (password hashing handled by User model pre-save hook)
    const user = new User({
      username,
      email,
      password, // Plaintext password, hashed by pre-save hook
      fullName,
      bio,
      address,
      mobile,
      aadhar,
    });
    
    await user.save();


    // Generate and set JWT token
    const token = generateToken(user._id, res);

    res.status(201).json({
      message: "User registered successfully",
      user: user.toJSON(), // Removes password via toJSON method
      token,
    });

  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
      message: error.message,
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

    // Generate and set JWT token
    const token = generateToken(user._id, res);

    res.json({
      message: 'Login successful',
      user: user.toJSON(), // Remove password
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
};


// Logout user
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0});
    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    res.status(500).json({
      error: 'Logout failed',
      message: error.message,
    });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      message: "Profile retrieved successfully",
      user: user.toJSON(), // Removes password
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve profile",
      message: error.message,
    });
  }
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
        message: "Profile updated successfully",
        user: updatedUser.toJSON(), // Removes password
      });
  } catch (error) {
    res.status(500).json({
      error: 'Profile update failed',
      message: error.message
    });
  }
};