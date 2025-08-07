const express = require('express');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Add comment to blog
router.post('/', auth, validate(schemas.comment), async (req, res) => {
  try {
    const { content, blogId } = req.body;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    const comment = new Comment({
      blogId,
      author: req.user._id,
      content
    });

    await comment.save();
    await comment.populate('author', 'username fullName avatar');

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to add comment',
      message: error.message
    });
  }
});

// Reply to comment
router.post('/:commentId/reply', auth, validate(schemas.comment), async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    const reply = new Comment({
      blogId: parentComment.blogId,
      author: req.user._id,
      content,
      parentComment: commentId
    });

    await reply.save();
    await reply.populate('author', 'username fullName avatar');

    // Add reply to parent comment's replies array
    await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: reply._id } }
    );

    res.status(201).json({
      message: 'Reply added successfully',
      reply
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to add reply',
      message: error.message
    });
  }
});

// Update comment
router.put('/:id', auth, validate(schemas.comment), async (req, res) => {
  try {
    const { content } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own comments'
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    ).populate('author', 'username fullName avatar');

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update comment',
      message: error.message
    });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own comments'
      });
    }

    // Soft delete - mark as deleted instead of removing
    await Comment.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, content: '[Comment deleted]' }
    );

    res.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete comment',
      message: error.message
    });
  }
});

// Like/Unlike comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    const hasLiked = comment.likes.users.includes(userId);
    
    let updateQuery;
    let message;
    
    if (hasLiked) {
      // Unlike
      updateQuery = {
        $pull: { 'likes.users': userId },
        $inc: { 'likes.count': -1 }
      };
      message = 'Comment unliked successfully';
    } else {
      // Like
      updateQuery = {
        $addToSet: { 'likes.users': userId },
        $inc: { 'likes.count': 1 }
      };
      message = 'Comment liked successfully';
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      updateQuery,
      { new: true }
    );

    res.json({
      message,
      isLiked: !hasLiked,
      likeCount: updatedComment.likes.count
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process like',
      message: error.message
    });
  }
});

// Get comment replies
router.get('/:commentId/replies', async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ 
      parentComment: commentId,
      isDeleted: false 
    })
      .populate('author', 'username fullName avatar')
      .sort({ createdAt: 1 }) // Replies in chronological order
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ 
      parentComment: commentId,
      isDeleted: false 
    });

    res.json({
      replies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReplies: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch replies',
      message: error.message
    });
  }
});

module.exports = router;