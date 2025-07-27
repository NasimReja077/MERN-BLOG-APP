// Backend/app.js // node js backend server

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
     origin: process.env.CORS_ORIGIN,
     credentials: true,
}));

// Body parsing middleware
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Health check route
app.get("/health", (req, res) =>{
     res.status(200).json({
          success: true,
          message: "Server is running.",
          timestamp: new Date().toISOString(),
     });
});

// // API Routes
// import authRoutes from './src/routes/auth.route.js';

// // Route Mounting
// app.use("/api/auth", authRoutes); 

// 404 handler
app.use('*',(req, res) =>{
     res.status(404).json({
          success: false,
          message: 'Route not found'
     });
});

export { app };