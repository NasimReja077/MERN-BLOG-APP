// Backend/routes/auth.route.js

import express from "express";
import{register, login, getProfile, updateProfile, logout} from "../controllers/auth.controller.js"
import { auth } from "../middleware/auth.js";

import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// Register user
router.post("/register", validate(schemas.register), register);

// Login user
router.post("/login", validate(schemas.login), login);

// Get user profile
router.get("/profile", auth, getProfile);

// Update user profile
router.put("/profile", auth, validate(schemas.updateProfile), updateProfile);

// Logout user
router.post("/logout", auth, logout);


export default router;