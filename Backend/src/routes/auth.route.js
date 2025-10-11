// Backend/routes/auth.route.js
import express from "express";
import{register, login, getProfile, updateProfile, logout, uplodeUserAvatar, uploadUserCoverImage} from "../controllers/auth.controller.js"
import { auth } from "../middleware/auth.js";

import { validate, schemas } from "../middleware/validation.js";
import { upload } from "../config/multer.js";
import { uploadAvatar, uploadCover } from "../middleware/uploadHandler.js";

const router = express.Router();

// Define upload middleware for multiple fields (avatar and coverImage)
const uploadProfileImages = upload.fields([
     {name: "avatar", maxCount: 1},
     {name: "coverImage", maxCount: 1},
]);


// Register user
router.post("/register", uploadProfileImages, validate(schemas.register), register);


// Login user
router.post("/login", validate(schemas.login), login);


// Get user profile
router.get("/profile", auth, getProfile);


// Update user profile
router.put("/profile", auth, uploadProfileImages, validate(schemas.updateProfile), updateProfile);


// Logout user
router.post("/logout", auth, logout);


// Upload user avatar (single file upload)
router.post("/upload/avatar", auth, uploadAvatar, uplodeUserAvatar );


// Upload user cover image (single file upload)
router.post("/upload/cover" , auth, uploadCover, uploadUserCoverImage);
export default router;