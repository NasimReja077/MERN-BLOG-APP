// Backend/src/models/user.model.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
     fullName: { 
          type: String,
          required: true,
          trim: true,
          maxlength: [150, 'Full name cannot exceed 150 characters'],
          index: true
     },
     email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          trim: true,
          lowercase: true,
          match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'], // Email regex validation
     },
     password: {
          type: String,
          required: [true, 'Password is required'],
          minlength: [6, 'Password must be at least 6 characters long']
     },
     username: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
          minlength: [3, 'Username must be at least 2 characters long'],
          maxlength: [20, 'Username cannot exceed 20 characters'],
          index: true
     },
     role: {
          type: String,
          enum: ['user', 'admin'],
          default: 'user'
     },
     avatar: {
          type: String, // cloudinary url
          default: 'https://as1.ftcdn.net/jpg/06/31/16/54/1000_F_631165406_6HfMsexCGHstso3udEHJmlFVzdSOevJ5.jpg'
     },
     coverImage: {
          type: String,
          default: 'https://flowbite.com/docs/images/examples/image-3@2x.jpg'
     },  
     profile:{
          bio: {
               type: String, 
               maxlength: [250, 'Bio cannot exceed 250 characters'], 
               default: '' // Short bio or description
          },
          // Indexing the profileTag field to allow for efficient searching
          // Note: Mongoose automatically creates a multikey index for array fields
          profileTag: [{
               type: String,
               maxlength: [50, 'Individual profile tag cannot exceed 50 characters'],
               default: [], // Array of tags, e.g., ['developer', 'javascript']
          }],

          interests: { type: [String], default: [] }, // Array of interests
          skills: { type: [String], default: [] }, // Array of skills

          website: { 
               type: String, 
               match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please provide a valid URL'], 
               default: '' 
          },
          socialLinks: {
               facebook: { type: String, default: '' },
               x: { type: String, default: '' },
               instagram: { type: String, default: '' },
               linkedin: { type: String, default: '' },
               github: { type: String, default: '' },
               dribbble: { type: String, default: '' },
               behance: { type: String, default: '' },
               youtube: { type: String, default: '' },
               upwork: { type: String, default: '' },
               medium: { type: String, default: '' },
               dev: { type: String, default: '' }
          },
          phone: { 
               type: String, 
               match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number'], 
               default: '' 
          },
          location: {
               city: { type: String, maxlength: [50, 'City cannot exceed 50 characters'], default: '' },
               state: { type: String, maxlength: [50, 'State cannot exceed 50 characters'], default: '' },
               country: { type: String, maxlength: [50, 'Country cannot exceed 50 characters'], default: '' }
          },
          preferences: {
               notifications: { type: Boolean, default: true }, // Email notifications preference
          },
          privacy: {
               profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' }, // Profile visibility setting
               searchEngineIndexing: { type: Boolean, default: true } // Whether the profile is indexed by search engines
          }
     },

     // Status fields
     isProfileComplete: { type: Boolean, default: false },
     isOnline: { type: Boolean, default: false },
     isPremiumMember: { type: Boolean, default: false },
     lastBlogPostDateTime: { type: Date, default: null },
     isActive: { type: Boolean, default: true },
     isDeleted: { type: Boolean, default: false },
     isVerified: { type: Boolean, default: false },
     
     // Authentication
     refreshToken: { type: String, default: '' },
     verificationToken: { type: String },
     verificationTokenExpiresAt: { type: Date },
     resetPasswordToken: { type: String },
     resetPasswordExpires: { type: Date },
     
     // Activity tracking
     lastLogin: { type: Date },
     lastLogout: { type: Date },
     loginCount: { type: Number, default: 0 },
     
     // Social features
     followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
     
     // Statistics
     totalPosts: { type: Number, default: 0 },
     totalComments: { type: Number, default: 0 },
     totalLikes: { type: Number, default: 0 },
     totalViews: { type: Number, default: 0 },
     totalShares: { type: Number, default: 0 },
     
     adminActions: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin'
     }]// Reference to Admin actions performed on the user
},
{
     timestamps: true, // Automatically manage createdAt and updatedAt fields
     toJSON: { virtuals: true }, // Include virtuals in JSON output
     toObject: { virtuals: true } // Include virtuals in object output
});

// Index for performance
userSchema.index({ username: 1, email: 1 }, { unique: true });
userSchema.index({ 'profile.profileTag': 1 });
userSchema.index({ createdAt: -1});

// Hash password before saving 
userSchema.pre("save", async function (next) {
     if (!this.isModified("password")) return next();
     try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          next();
     } catch (error) {
          next(error);
     }
});

// Compare password method
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
     return await bcrypt.compare(candidatePassword, this.password);
};


// Virtuals for counts
userSchema.virtual('followerCount').get(function () {
  return this.followers ? this.followers.length : 0;
});
userSchema.virtual('followingCount').get(function () {
  return this.following ? this.following.length : 0;
});

// Export the User model
export const User = mongoose.model('User', userSchema);


// add JWT 