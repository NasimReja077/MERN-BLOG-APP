// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  featuredImage: {
    type: String,
    default: null
  },
  views: {
    count: {
      type: Number,
      default: 0
    },
    uniqueUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  likes: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  shares: {
    count: {
      type: Number,
      default: 0
    },
    platforms: [{
      platform: {
        type: String,
        enum: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email']
      },
      count: {
        type: Number,
        default: 0
      }
    }]
  }
}, {
  timestamps: true
});

// Indexes for performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ 'views.count': -1 });
blogSchema.index({ 'likes.count': -1 });

module.exports = mongoose.model('Blog', blogSchema);