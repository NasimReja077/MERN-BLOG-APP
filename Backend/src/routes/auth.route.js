// Backend/src/routes/auth.route.js 

import express from "express";
// import { getUser, getAllUsers } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.send("Signup route works!");
});

router.get("/login", (req, res) => {
  res.send("Login route works!");
});

export default router;