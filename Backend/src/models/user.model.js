// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  fullName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  avatar: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500
  },
  address: {
    type: String,
    trim: true,
    maxlength: 200,
    default: null
  },
  mobile: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
    default: null
  },
  aadhar: {
    type: String,
    trim: true,
    match: [/^\d{12}$/, 'Aadhar number must be 12 digits'],
    unique: true,
    sparse: true,
    default: null
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ aadhar: 1});


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};
export const User = mongoose.model('User', userSchema);