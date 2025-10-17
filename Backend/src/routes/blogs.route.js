// Backend/routes/blogs.route.js
import express from "express";
import { getAllBlogs,getBlogsByUser,getBlogById,createBlog,updateBlog,deleteBlog,trackBlogView,likeBlog,trackBlogShare, uploadContentThumbnail, uploadContentImages} from "../controllers/blog.controller.js";
import { auth } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";
import { upload } from "../config/multer.js";
import { uploadBlogContentImages } from "../middleware/uploadHandler.js";
// const { validate, schemas } = require('../middleware/validation.js');

const router = express.Router();

const updateBlogImages = upload.fields([
     { name: "thumbnail", maxCount: 1 },
     { name: "contentImages", maxCount: 10 },
]);

// Get all blogs with pagination
router.get("/", getAllBlogs);

// Get user's blogs
router.get("/user/:userId", getBlogsByUser);


// Get single blog
router.get("/:id", getBlogById);

// Create new blog
router.post("/", auth, updateBlogImages, validate(schemas.blog), createBlog);

// Update blog
router.put("/:id", auth, updateBlogImages, validate(schemas.blog), updateBlog);

// Delete blog
router.delete("/:id", auth, deleteBlog);

// Upload blog thumbnail
router.post("/:id/thumbnail", auth,  updateBlogImages, uploadContentThumbnail);
// upload content images
router.post("/:id/content-images", auth, uploadBlogContentImages, uploadContentImages);

// Track blog view
router.post("/:id/view", trackBlogView);

// Like/Unlike blog
router.post("/:id/like", auth, likeBlog);

// Track blog share
router.post("/:id/share", validate(schemas.share), trackBlogShare);

// Get blog comments
// router.get("/:blogId/comments", getBlogComments);


export default router;
