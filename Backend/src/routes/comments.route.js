// Backend/routes/comments.route.js

import express from "express";
import {addComment,
  addReply,
  updateComment,
  deleteComment,
  likeComment,
  getCommentReplies,
  getBlogComments
} from "../controllers/comment.controller.js";
import { auth } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// Add comment to blog
router.post("/", auth, validate(schemas.comment), addComment);

// Reply to comment
router.post("/:commentId/reply", auth, validate(schemas.reply), addReply);

// Update comment
router.put("/:id", auth, validate(schemas.comment), updateComment);

// Delete comment
router.delete("/:id", auth, deleteComment);

// Like/Unlike comment
router.post("/:id/like", auth, likeComment);

// Get comment replies
router.get("/:commentId/replies", getCommentReplies);

// Get blog comments
router.get("/:blogId/comments", getBlogComments);

export default router;