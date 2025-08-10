import express from "express";
import { Blog } from "../models/Blog.model.js";
import { Comment } from "../models/Comment.model.js";
import { auth } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
// const { validate, schemas } = require('../middleware/validation.js');

const router = express.Router();

// Get all blogs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, tag, author, sortBy, sortOrder } = req.query;
    
    // Build filter object
    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (author) filter.author = author;

    // Build sort object
    let sort = { createdAt: -1 }; // default sort
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'views') sort = { 'views.count': order };
      if (sortBy === 'likes') sort = { 'likes.count': order };
      if (sortBy === 'date') sort = { createdAt: order };
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ 
      Blog, 
      parentComment: null,
      isDeleted: false 
    });

    res.json({
      Comment,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch comments',
      message: error.message
    });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username fullName avatar bio');

    if (!blog || blog.status !== 'published') {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    res.json({ blog });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch blog',
      message: error.message
    });
  }
});

// Create new blog
router.post('/', auth, validate(schemas.blog), async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user._id
    };

    const blog = new Blog(blogData);
    await blog.save();
    
    await blog.populate('author', 'username fullName avatar');

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create blog',
      message: error.message
    });
  }
});

// Update blog
router.put('/:id', auth, validate(schemas.blog), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own blogs'
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username fullName avatar');

    res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update blog',
      message: error.message
    });
  }
});

// Delete blog
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own blogs'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);
    
    // Delete all comments for this blog
    await Comment.deleteMany({ blogId: req.params.id });

    res.json({
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete blog',
      message: error.message
    });
  }
});

// Track blog view
router.post('/:id/view', async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.body.userId; // Optional: track unique views
    
    const updateQuery = { $inc: { 'views.count': 1 } };
    
    // If userId provided, add to uniqueUsers array if not already present
    if (userId) {
      updateQuery.$addToSet = { 'views.uniqueUsers': userId };
    }

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      updateQuery,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    res.json({
      message: 'View tracked successfully',
      viewCount: blog.views.count,
      uniqueViewCount: blog.views.uniqueUsers.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to track view',
      message: error.message
    });
  }
});

// Like/Unlike blog
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    const hasLiked = blog.likes.users.includes(userId);
    
    let updateQuery;
    let message;
    
    if (hasLiked) {
      // Unlike
      updateQuery = {
        $pull: { 'likes.users': userId },
        $inc: { 'likes.count': -1 }
      };
      message = 'Blog unliked successfully';
    } else {
      // Like
      updateQuery = {
        $addToSet: { 'likes.users': userId },
        $inc: { 'likes.count': 1 }
      };
      message = 'Blog liked successfully';
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateQuery,
      { new: true }
    );

    res.json({
      message,
      isLiked: !hasLiked,
      likeCount: updatedBlog.likes.count
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process like',
      message: error.message
    });
  }
});

// Track blog share
router.post('/:id/share', validate(schemas.share), async (req, res) => {
  try {
    const blogId = req.params.id;
    const { platform } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Find existing platform or create new one
    const platformIndex = blog.shares.platforms.findIndex(p => p.platform === platform);
    
    let updateQuery;
    if (platformIndex >= 0) {
      // Increment existing platform count
      updateQuery = {
        $inc: { 
          'shares.count': 1,
          [`shares.platforms.${platformIndex}.count`]: 1 
        }
      };
    } else {
      // Add new platform
      updateQuery = {
        $inc: { 'shares.count': 1 },
        $push: { 'shares.platforms': { platform, count: 1 } }
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateQuery,
      { new: true }
    );

    res.json({
      message: 'Share tracked successfully',
      shareCount: updatedBlog.shares.count,
      platformShares: updatedBlog.shares.platforms
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to track share',
      message: error.message
    });
  }
});

// Get blog comments
router.get('/:blogId/comments', async (req, res) => {
  try {
    const { blogId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get top-level comments (no parent)
    const comments = await Comment.find({ 
      blogId, 
      parentComment: null,
      isDeleted: false 
    })
      .populate('author', 'username fullName avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username fullName avatar'
        }
      })
      .sort
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.json({
      Blog,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch blogs',
      message: error.message
    });
  }
});


export default router;
