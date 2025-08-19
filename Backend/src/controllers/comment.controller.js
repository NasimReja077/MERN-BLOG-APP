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
          message: "The provided blogId is not a valid MongoDB ObjectId",
        });
      }

    // Check if blog exists and is published
    const blog = await Blog.findById(blogId);
      if (!blog || blog.status !== "published") {
        return res.status(404).json({
          error: "Blog not found or not published",
          message: "The requested blog is either unpublished or does not exist",
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
    console.error("Error in addComment:", error.message);
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
          message: "The provided commentId is not a valid MongoDB ObjectId",
        });
      }

    // Check if parent comment exists and is not deleted
    const parentComment = await Comment.findById(commentId);
      if (!parentComment) {
        return res.status(404).json({
          error: "Comment not found",
          message: `No comment found with ID: ${commentId}`,
        });
      }
      if (parentComment.isDeleted) {
        return res.status(403).json({
          error: "Cannot reply to deleted comment",
          message: "The parent comment has been deleted",
        });
      }

      // Limit reply depth (e.g., no replies to replies)
      if (parentComment.parentComment) {
        return res.status(400).json({
          error: "Reply depth exceeded",
          message: "Replies to replies are not allowed",
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
          message: "The provided commentId is not a valid MongoDB ObjectId",
        });
      }

    const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({
          error: "Comment not found",
          message: `No comment found with ID: ${id}`,
        });
      }

    // Check if comment is deleted
    if (comment.isDeleted) {
        return res.status(403).json({
          error: "Cannot update deleted comment",
          message: "The comment has been deleted",
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
      { new: true, runValidators: true }
    ).populate("author", "username fullName avatar");

    res.json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error in updateComment:", error.message);
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
        message: "The provided commentId is not a valid MongoDB ObjectId",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
        message: `No comment found with ID: ${id}`,
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
    console.error("Error in deleteComment:", error.message);
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
        message: "The provided commentId is not a valid MongoDB ObjectId",
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        error: "Comment not found",
        message: `No comment found with ID: ${id}`,
      });
    }

    // Check if comment is deleted
    if (comment.isDeleted) {
      return res.status(403).json({
        error: "Cannot like deleted comment",
        message: "The comment has been deleted",
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
    console.error("Error in likeComment:", error.message);
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
        message: "The provided commentId is not a valid MongoDB ObjectId",
      });
    }

    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        error: "Comment not found",
        message: `No comment found with ID: ${commentId}`,
      });
    }
    if (parentComment.isDeleted) {
      return res.status(403).json({
        error: "Cannot fetch replies for deleted comment",
        message: "The parent comment has been deleted",
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

    const totalReplies = await Comment.countDocuments({
      parentComment: commentId,
      isDeleted: false,
    });

    res.json({
      replies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReplies / limit),
        totalReplies,
        hasNext: page < Math.ceil(totalReplies / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getCommentReplies:", error.message);
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
    if (!blog || blog.status !== "published") {
      return res.status(404).json({
        error: "Blog not found or not published",
        message: "The requested blog is either unpublished or does not exist",
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
        options: { sort: { createdAt: 1 }, limit: 5 }, // Sort replies by oldest first
      })
      .sort({ createdAt: -1 }) // Newest comments first
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({
      blogId,
      parentComment: null,
      isDeleted: false,
    });

    res.json({
      comments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalComments / limit),
        totalComments,
        hasNext: page < Math.ceil(totalComments / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error in getBlogComments:', error.message);
    res.status(500).json({
      error: 'Failed to fetch comments',
      message: error.message,
    });
  }
};