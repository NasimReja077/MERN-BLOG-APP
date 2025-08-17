import { Blog } from "../models/Blog.model.js";
import { Comment } from "../models/Comment.model.js";
import mongoose from "mongoose";

// Add comment to blog
export const addComment = async (req, res) => {
  try {
    const { content, blogId } = req.body;

    // Validate blogId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        error: "Invalid blog ID",
      });
    }

    // Check if blog exists and is published
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }
    if (blog.status !== "published") {
      return res.status(403).json({
        error: "Cannot comment on unpublished blog",
      });
    }

    const comment = new Comment({
      blogId,
      author: req.user._id,
      content,
    });

    await comment.save();
    await comment.populate("author", "username fullName avatar");

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error in addComment:", error); // Add logging for debugging
    res.status(500).json({
      error: "Failed to add comment",
      message: error.message,
    });
  }
};

// Reply to comment
export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    // Validate commentId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        error: "Invalid comment ID",
      });
    }

    // Check if parent comment exists and is not deleted
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }
    if (parentComment.isDeleted) {
      return res.status(403).json({
        error: "Cannot reply to deleted comment",
      });
    }

    const reply = new Comment({
      blogId: parentComment.blogId,
      author: req.user._id,
      content,
      parentComment: commentId,
    });

    await reply.save();
    await reply.populate("author", "username fullName avatar");

    // Add reply to parent comment's replies array
    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });

    res.status(201).json({
      message: "Reply added successfully",
      reply,
    });
  } catch (error) {
    console.error("Error in addReply:", error);
    res.status(500).json({
      error: "Failed to add reply",
      message: error.message,
    });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Validate commentId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    // Check if comment is deleted
    if (comment.isDeleted) {
      return res.status(403).json({
        error: "Cannot update deleted comment",
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only update your own comments",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    ).populate("author", "username fullName avatar");

    res.json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error in updateComment:", error);
    res.status(500).json({
      error: "Failed to update comment",
      message: error.message,
    });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate commentId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Access denied",
        message: "You can only delete your own comments",
      });
    }

    // Soft delete - mark as deleted instead of removing
    await Comment.findByIdAndUpdate(id, {
      isDeleted: true,
      content: "[Comment deleted]",
    });

    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({
      error: "Failed to delete comment",
      message: error.message,
    });
  }
};

// Like/Unlike comment
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate commentId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid comment ID",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    // Check if comment is deleted
    if (comment.isDeleted) {
      return res.status(403).json({
        error: "Cannot like deleted comment",
      });
    }

    const hasLiked = comment.likes.users.includes(userId);

    let updateQuery;
    let message;

    if (hasLiked) {
      // Unlike
      updateQuery = {
        $pull: { "likes.users": userId },
        $inc: { "likes.count": -1 },
      };
      message = "Comment unliked successfully";
    } else {
      // Like
      updateQuery = {
        $addToSet: { "likes.users": userId },
        $inc: { "likes.count": 1 },
      };
      message = "Comment liked successfully";
    }

    const updatedComment = await Comment.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    res.json({
      message,
      isLiked: !hasLiked,
      likeCount: updatedComment.likes.count,
    });
  } catch (error) {
    console.error("Error in likeComment:", error);
    res.status(500).json({
      error: "Failed to process like",
      message: error.message,
    });
  }
};

// Get comment replies
export const getCommentReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate commentId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        error: "Invalid comment ID",
      });
    }

    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    const replies = await Comment.find({
      parentComment: commentId,
      isDeleted: false,
    })
      .populate("author", "username fullName avatar")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({
      parentComment: commentId,
      isDeleted: false,
    });

    res.json({
      replies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReplies: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getCommentReplies:", error);
    res.status(500).json({
      error: "Failed to fetch replies",
      message: error.message,
    });
  }
};

// Get blog comments
export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Validate blogId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        error: 'Invalid blog ID',
        message: 'The provided blogId is not a valid MongoDB ObjectId',
      });
    }

    // Check if blog exists and is published
    const blog = await Blog.findById(blogId);
    if (!blog || blog.status !== 'published') {
      return res.status(404).json({
        error: 'Blog not found or not published',
        message: `No published blog found with ID: ${blogId}`,
      });
    }

    // Get top-level comments (no parent)
    const comments = await Comment.find({
      blogId,
      parentComment: null,
      isDeleted: false,
    })
      .populate('author', 'username fullName avatar')
      .populate({
        path: 'replies',
        match: { isDeleted: false },
        populate: {
          path: 'author',
          select: 'username fullName avatar',
        },
      })
      .sort({ createdAt: -1 }) // Newest comments first
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({
      blogId,
      parentComment: null,
      isDeleted: false,
    });

    console.log(`Fetched ${comments.length} comments for blog: ${blogId}`);

    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalComments: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error in getBlogComments:', error);
    res.status(500).json({
      error: 'Failed to fetch comments',
      message: error.message,
    });
  }
};