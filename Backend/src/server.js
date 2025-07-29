// server.js
import express from "express";
// import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
// const blogRoutes = require('./routes/blogs');
// const commentRoutes = require('./routes/comments');
// const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(
//   (err) => {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   });

// Routes
app.use("/api/auth", authRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/comments', commentRoutes);

app.get('/test', (req, res) => {
  res.send('OK');
});


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Blog API is running' });
});

// Error handling middleware
// app.use(errorHandler);

// 404 handler

// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
