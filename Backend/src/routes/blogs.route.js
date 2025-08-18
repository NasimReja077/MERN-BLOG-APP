// Backend/routes/blogs.route.js
import express from "express";
import { getAllBlogs,getBlogsByUser,getBlogById,createBlog,updateBlog,deleteBlog,trackBlogView,likeBlog,trackBlogShare} from "../controllers/blog.controller.js";
import { auth } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
// const { validate, schemas } = require('../middleware/validation.js');

const router = express.Router();

// Get all blogs with pagination
router.get("/", getAllBlogs);

// Get user's blogs
router.get("/user/:userId", getBlogsByUser);

// Get single blog
router.get("/:id", getBlogById);

// Create new blog
router.post("/", auth, validate(schemas.blog), createBlog);

// Update blog
router.put("/:id", auth, validate(schemas.blog), updateBlog);

// Delete blog
router.delete("/:id", auth, deleteBlog);

// Track blog view
router.post("/:id/view", trackBlogView);

// Like/Unlike blog
router.post("/:id/like", auth, likeBlog);

// Track blog share
router.post("/:id/share", validate(schemas.share), trackBlogShare);

// Get blog comments
// router.get("/:blogId/comments", getBlogComments);


export default router;
