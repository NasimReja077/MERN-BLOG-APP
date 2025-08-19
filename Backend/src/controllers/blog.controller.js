import mongoose from "mongoose";
import { Blog } from "../models/Blog.model.js";
import { Comment } from "../models/Comment.model.js";
import { User } from "../models/User.model.js";

// Get all blogs with pagination and comments
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const commentLimit = parseInt(req.query.commentLimit) || 10; // New query param for comments
    const skip = (page - 1) * limit;
    
    const { category, tag, author, sortBy, sortOrder } = req.query;

    // Validate author ID if provided
    if (author && !mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({
        error: "Invalid author ID",
        message: "The provided author ID is not a valid MongoDB ObjectId",
      });
    }
    
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
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
      // Always include comments with pagination
      const blogsWithComments = await Promise.all(
        blogs.map(async (blog) => {
          const commentPage = parseInt(req.query.commentPage) || 1;
          const commentSkip = (commentPage - 1) * commentLimit;

          const comments = await Comment.find({
            blogId: blog._id,
            parentComment: null,
            isDeleted: false,
          })
            .populate("author", "username fullName avatar")
            .populate({
              path: "replies",
              match: { isDeleted: false },
              populate: {
                path: "author",
                select: "username fullName avatar",
              },
              options: { sort: { createdAt: 1 }, limit: 5 }, // Limit replies to 5 per comment
          })
          .sort({ createdAt: -1 })
          .skip(commentSkip)
          .limit(commentLimit);

        const totalComments = await Comment.countDocuments({
          blogId: blog._id,
          parentComment: null,
          isDeleted: false,
        });

        return {
          ...blog.toObject(),
          comments,
          commentsCount: totalComments,
          commentPagination: {
            currentPage: commentPage,
            totalPages: Math.ceil(totalComments / commentLimit),
            totalComments,
            hasNext: commentPage < Math.ceil(totalComments / commentLimit),
            hasPrev: commentPage > 1,
          },
        };
      })
    );

    const totalBlogs = await Blog.countDocuments(filter);

    res.json({
      blogs: blogsWithComments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
        hasNext: page < Math.ceil(totalBlogs / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAllBlogs:", error.message);
    res.status(500).json({
      error: "Failed to fetch blogs",
      message: error.message,
    });
  }
};

// Get blogs by user
export const getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const commentLimit = parseInt(req.query.commentLimit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "The provided userId is not a valid MongoDB ObjectId",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: `No user found with ID: ${userId}`,
      });
    }

    const filter = { author: userId };
    if (status) filter.status = status;

    const blogs = await Blog.find(filter)
      .populate("author", "username fullName avatar address mobile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const blogsWithComments = await Promise.all(
      blogs.map(async (blog) => {
        const commentPage = parseInt(req.query.commentPage) || 1;
        const commentSkip = (commentPage - 1) * commentLimit;

        const comments = await Comment.find({
          blogId: blog._id,
          parentComment: null,
          isDeleted: false,
        })
          .populate("author", "username fullName avatar")
          .populate({
            path: "replies",
            match: { isDeleted: false },
            populate: {
              path: "author",
              select: "username fullName avatar",
            },
            options: { sort: { createdAt: 1 }, limit: 5 },
          })
          .sort({ createdAt: -1 })
          .skip(commentSkip)
          .limit(commentLimit);

        const totalComments = await Comment.countDocuments({
          blogId: blog._id,
          parentComment: null,
          isDeleted: false,
        });

        return {
          ...blog.toObject(),
          comments,
          commentsCount: totalComments,
          commentPagination: {
            currentPage: commentPage,
            totalPages: Math.ceil(totalComments / commentLimit),
            totalComments,
            hasNext: commentPage < Math.ceil(totalComments / commentLimit),
            hasPrev: commentPage > 1,
          },
        };
      })
    );

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs: blogsWithComments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getBlogsByUser:", error.message);
    res.status(500).json({
      error: "Failed to fetch blogs",
      message: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username fullName avatar bio"
    );

    if (!blog || blog.status !== "published") {
      return res.status(404).json({
        error: "Blog not found or not published",
        message: "The requested blog is either unpublished or does not exist",
      });
    }

    const commentPage = parseInt(req.query.commentPage) || 1;
    const commentLimit = parseInt(req.query.commentLimit) || 10;
    const commentSkip = (commentPage - 1) * commentLimit;

    const comments = await Comment.find({
      blogId: blog._id,
      parentComment: null,
      isDeleted: false,
    })
      .populate("author", "username fullName avatar")
      .populate({
        path: "replies",
        match: { isDeleted: false },
        populate: {
          path: "author",
          select: "username fullName avatar",
        },
        options: { sort: { createdAt: 1 }, limit: 5 },
      })
      .sort({ createdAt: -1 })
      .skip(commentSkip)
      .limit(commentLimit);

    const commentsCount = await Comment.countDocuments({
      blogId: blog._id,
      parentComment: null,
      isDeleted: false,
    });

    res.json({
      blog: {
        ...blog.toObject(),
        comments,
        commentsCount,
        commentPagination: {
          currentPage: commentPage,
          totalPages: Math.ceil(commentsCount / commentLimit),
          totalComments: commentsCount,
          hasNext: commentPage < Math.ceil(commentsCount / commentLimit),
          hasPrev: commentPage > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error in getBlogById:", error.message);
    res.status(500).json({
      error: "Failed to fetch blog",
      message: error.message,
    });
  }
};

// Create new blog
export const createBlog = async (req, res) => {
  try {
      const blogData = {
        ...req.body,
        author: req.user._id,
      };

      const blog = new Blog(blogData);
      await blog.save();

      await blog.populate("author", "username fullName avatar");

      res.status(201).json({
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
     console.error("Error in createBlog:", error.message);
      res.status(500).json({
        error: "Failed to create blog",
        message: error.message,
      });
  }
};


export const updateBlog = async (req, res) => {
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
};

// Delete blog
export const deleteBlog = async (req, res) => {
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
};

// Track blog view
export const trackBlogView = async (req, res) => {
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
};

// Like/Unlike blog
export const likeBlog = async (req, res) => {
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
};

// Track blog share
export const trackBlogShare = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { platform } = req.body;

    const validPlatforms = ['facebook', 'twitter', 'linkedin', 'whatsapp'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        error: 'Invalid platform',
        message: `Platform must be one of: ${validPlatforms.join(', ')}`
      });
    }

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
};