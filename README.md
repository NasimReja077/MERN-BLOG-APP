# 📝 BlogApp - Modern Full-Stack Blogging Platform

<div align="center">

![BlogApp Banner](https://via.placeholder.com/1200x300/0e75b6/ffffff?text=BlogApp+-+Share+Your+Story)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.16-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**A feature-rich, production-ready blogging platform built with the MERN stack**

[Live Demo](#) · [Report Bug](https://github.com/NasimReja077/MERN-BLOG-APP/issues) · [Request Feature](https://github.com/NasimReja077/MERN-BLOG-APP/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Usage Examples](#-usage-examples)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About The Project

BlogApp is a modern, full-featured blogging platform that empowers writers to share their stories and connect with a global audience. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it offers a seamless content creation experience with enterprise-grade features including rich text editing, media management, user authentication, and real-time engagement.

### Why BlogApp?

- **🚀 Production-Ready**: Built with best practices and industry standards
- **⚡ High Performance**: Optimized queries, code splitting, and CDN integration
- **🔐 Secure**: JWT authentication, input validation, rate limiting, and XSS protection
- **📱 Responsive**: Mobile-first design that works on all devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth user experience
- **🔧 Easy to Deploy**: Docker support and comprehensive deployment guides

---

## ✨ Key Features

### For Writers & Content Creators

- 📝 **Dual-Mode Rich Text Editor**
  - Visual WYSIWYG editor (TinyMCE)
  - Markdown mode for developers
  - Real-time preview
  - Code syntax highlighting
  
- 🖼️ **Media Management**
  - Drag-and-drop image upload
  - Cloudinary integration for fast CDN delivery
  - Support for thumbnails and content images
  - Automatic image optimization

- 📊 **Content Organization**
  - Categories and tags
  - Draft/Published status
  - Search and filter
  - Analytics dashboard (views, likes, comments)

### For Readers & Community

- 💬 **Interactive Engagement**
  - Nested comments and replies
  - Like posts and comments
  - Share on social media
  - Reading time estimation

- 🔍 **Discovery Features**
  - Advanced search with filters
  - Browse by category/tags
  - Sort by popularity/date
  - Pagination for better performance

- 👤 **User Profiles**
  - Customizable avatars and cover images
  - Bio and contact information
  - View user's published blogs

### Security & Authentication

- 🔐 **Secure Authentication**
  - JWT-based stateless authentication
  - HTTP-only cookies for token storage
  - Email verification with OTP (Nodemailer)
  - Password recovery with secure tokens
  
- 🛡️ **Data Protection**
  - Input validation (client & server)
  - XSS protection (Helmet)
  - Rate limiting to prevent abuse
  - CORS configuration
  - Bcrypt password hashing

### Performance & Scalability

- ⚡ **Optimized Backend**
  - Efficient MongoDB indexing
  - Pagination for large datasets
  - Cloudinary for media delivery
  - Response caching strategies

- 🚀 **Frontend Performance**
  - Code splitting with Vite
  - Lazy loading of routes
  - Redux Toolkit for state management
  - Debounced search queries

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | UI Library | 19.2.0 |
| **Redux Toolkit** | State Management | 2.11.0 |
| **React Router DOM** | Routing | 7.10.0 |
| **React Hook Form** | Form Handling | 7.67.0 |
| **Zod** | Schema Validation | 4.1.13 |
| **TinyMCE** | Rich Text Editor | 6.3.0 |
| **md-editor-rt** | Markdown Editor | 6.3.0 |
| **Tailwind CSS** | Styling | 4.1.17 |
| **DaisyUI** | Component Library | 5.5.8 |
| **Axios** | HTTP Client | 1.13.2 |
| **React Hot Toast** | Notifications | 2.6.0 |
| **date-fns** | Date Formatting | 4.1.0 |
| **DOMPurify** | XSS Prevention | 3.3.1 |
| **Vite** | Build Tool | 7.2.4 |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 18+ |
| **Express.js** | Web Framework | 5.1.0 |
| **MongoDB** | Database | 8.16.4 |
| **Mongoose** | ODM | 8.16.4 |
| **JWT** | Authentication | 9.0.2 |
| **Bcrypt.js** | Password Hashing | 3.0.2 |
| **Nodemailer** | Email Service | 7.0.10 |
| **Cloudinary** | Media Storage | 2.7.0 |
| **Multer** | File Upload | 2.0.2 |
| **Helmet** | Security Headers | 8.1.0 |
| **CORS** | Cross-Origin | 2.8.5 |
| **Express Rate Limit** | Rate Limiting | 8.0.1 |
| **Joi** | Validation | 17.13.3 |
| **Dotenv** | Environment Config | 17.2.0 |

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │ Redux Store  │  │  React Router│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │  Middleware  │  │  Controllers │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │  Cloudinary  │  │   Nodemailer │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

```
┌──────────────────────────────────────────────────────────────┐
│                           Users                               │
├──────────────────────────────────────────────────────────────┤
│ _id, username, email, password (hashed), fullName, bio,      │
│ avatar, coverImage, address, mobile, aadhar, isVerified,     │
│ verificationCode, resetPasswordToken, createdAt, updatedAt   │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N (author)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                           Blogs                               │
├──────────────────────────────────────────────────────────────┤
│ _id, title, content, summary, author (ref: User),            │
│ thumbnail, contentImages[], tags[], category, status,        │
│ views: {count, uniqueUsers[]}, likes: {count, users[]},     │
│ shares: {count, platforms[]}, createdAt, updatedAt          │
└──────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N (blogId)
                            ▼
┌──────────────────────────────────────────────────────────────┐
│                         Comments                              │
├──────────────────────────────────────────────────────────────┤
│ _id, blogId (ref: Blog), author (ref: User), content,       │
│ parentComment (ref: Comment), replies[], isDeleted,          │
│ likes: {count, users[]}, createdAt, updatedAt               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** - [Download](https://git-scm.com/)
- **Cloudinary Account** (Free) - [Sign Up](https://cloudinary.com/)
- **Gmail Account** (for email service)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/NasimReja077/MERN-BLOG-APP.git
cd MERN-BLOG-APP
```

2. **Install Backend Dependencies**

```bash
cd Backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../Frontend
npm install
```

### Environment Variables

#### Backend Configuration

Create a `.env` file in the `Backend` directory:

```bash
cd Backend
cp .env.sample .env
```

Update `.env` with your credentials:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/blog_app

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure

# Cloudinary Configuration (Get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM_TEAM_NAME=BlogApp Team
```

#### Frontend Configuration

Create a `.env` file in the `Frontend` directory:

```bash
cd ../Frontend
cp .env.sample .env
```

Update `.env`:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# TinyMCE API Key (Get free key from tiny.cloud)
VITE_TINYMCE_API_KEY=your_tinymce_api_key

# Uploadcare Public Key (optional)
VITE_TINYMCE_PUBLIC_KEY=your_uploadcare_key
```

#### Setting Up Gmail for Email Service

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate a password for "Mail"
3. Use this password in `EMAIL_PASS`

### Running the Application

#### Development Mode

**Start Backend Server:**

```bash
cd Backend
npm run dev
```

Backend will run on `http://localhost:3000`

**Start Frontend Development Server:**

```bash
cd Frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

#### Production Mode

**Backend:**

```bash
cd Backend
npm start
```

**Frontend:**

```bash
cd Frontend
npm run build
npm run preview
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: multipart/form-data

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "bio": "Developer and writer",
  "avatar": <file>,
  "coverImage": <file>,
  "mobile": "1234567890",
  "aadhar": "123456789012"
}

Response: {
  "success": true,
  "message": "User registered successfully",
  "user": {...},
  "token": "jwt_token"
}
```

#### Verify OTP
```http
POST /auth/otp-verify

{
  "code": "123456"
}

Response: {
  "success": true,
  "message": "Email verified successfully"
}
```

#### Login
```http
POST /auth/login

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "success": true,
  "message": "Login successful",
  "user": {...},
  "token": "jwt_token"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>

Response: {
  "success": true,
  "message": "Logged out successfully"
}
```

#### Forgot Password
```http
POST /auth/forgot-password

{
  "email": "john@example.com"
}

Response: {
  "success": true,
  "message": "Password reset link sent to your email"
}
```

#### Reset Password
```http
POST /auth/reset-password

{
  "token": "reset_token",
  "newPassword": "newpassword123"
}

Response: {
  "success": true,
  "message": "Password reset successfully"
}
```

### Blog Endpoints

#### Get All Blogs
```http
GET /blogs?page=1&limit=10&category=technology&sortBy=date&sortOrder=desc

Response: {
  "blogs": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalBlogs": 95,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Blog by ID
```http
GET /blogs/:id

Response: {
  "blog": {...}
}
```

#### Create Blog
```http
POST /blogs
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "My Blog Title",
  "content": "<p>Blog content in HTML</p>",
  "summary": "Short summary",
  "category": "Technology",
  "tags": ["react", "nodejs"],
  "status": "published",
  "thumbnail": <file>,
  "contentImages": [<file1>, <file2>]
}

Response: {
  "message": "Blog created successfully",
  "blog": {...}
}
```

#### Update Blog
```http
PUT /blogs/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Updated Title",
  "content": "<p>Updated content</p>",
  ...
}

Response: {
  "message": "Blog updated successfully",
  "blog": {...}
}
```

#### Delete Blog
```http
DELETE /blogs/:id
Authorization: Bearer <token>

Response: {
  "message": "Blog deleted successfully"
}
```

#### Like Blog
```http
POST /blogs/:id/like
Authorization: Bearer <token>

Response: {
  "message": "Blog liked successfully",
  "isLiked": true,
  "likeCount": 42
}
```

### Comment Endpoints

#### Get Blog Comments
```http
GET /comments/blog/:blogId?page=1&limit=20

Response: {
  "comments": [...],
  "pagination": {...}
}
```

#### Add Comment
```http
POST /comments
Authorization: Bearer <token>

{
  "blogId": "blog_id",
  "content": "Great article!"
}

Response: {
  "message": "Comment added successfully",
  "comment": {...}
}
```

#### Add Reply
```http
POST /comments/:commentId/reply
Authorization: Bearer <token>

{
  "content": "Thanks for your comment!"
}

Response: {
  "message": "Reply added successfully",
  "reply": {...}
}
```

For complete API documentation, see [API_REFERENCE.md](./docs/API_REFERENCE.md)

---

## 📁 Project Structure

```
MERN-BLOG-APP/
│
├── Backend/                      # Node.js/Express Backend
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── cloudinary.js    # Cloudinary setup
│   │   │   ├── mailer.config.js # Email configuration
│   │   │   └── multer.js        # File upload config
│   │   │
│   │   ├── controllers/         # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── blog.controller.js
│   │   │   └── comment.controller.js
│   │   │
│   │   ├── models/              # MongoDB schemas
│   │   │   ├── User.model.js
│   │   │   ├── Blog.model.js
│   │   │   └── Comment.model.js
│   │   │
│   │   ├── routes/              # API routes
│   │   │   ├── auth.route.js
│   │   │   ├── blogs.route.js
│   │   │   └── comments.route.js
│   │   │
│   │   ├── middleware/          # Custom middleware
│   │   │   ├── auth.js          # JWT verification
│   │   │   ├── errorHandler.js  # Error handling
│   │   │   ├── uploadHandler.js # File upload logic
│   │   │   └── validation.js    # Request validation
│   │   │
│   │   ├── mailer/              # Email templates
│   │   │   ├── emailService.js
│   │   │   └── emailTemplates.js
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   ├── generateToken.js
│   │   │   └── generateOTP.js
│   │   │
│   │   ├── db/                  # Database connection
│   │   │   └── connectDB.js
│   │   │
│   │   └── server.js            # Entry point
│   │
│   ├── public/uploads/          # Temporary file storage
│   ├── .env.sample              # Environment template
│   ├── .gitignore
│   └── package.json
│
├── Frontend/                     # React Frontend
│   ├── src/
│   │   ├── api/                 # API client
│   │   │   ├── axios.js
│   │   │   ├── authApi.js
│   │   │   ├── blogApi.js
│   │   │   ├── commentApi.js
│   │   │   └── index.js
│   │   │
│   │   ├── components/          # Reusable components
│   │   │   ├── UI/
│   │   │   │   ├── blog/       # Blog components
│   │   │   │   ├── editor/     # Rich text editor
│   │   │   │   ├── profile/    # Profile components
│   │   │   │   └── thumbnail/  # Thumbnail uploader
│   │   │   │
│   │   │   ├── layout/         # Layout components
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── AppLayout.jsx
│   │   │   │
│   │   │   ├── feedback/       # User feedback
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   └── ToastProvider.jsx
│   │   │   │
│   │   │   ├── routes/         # Route protection
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── RedirectAuthUser.jsx
│   │   │   │
│   │   │   └── constants/      # App constants
│   │   │       └── index.js
│   │   │
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── AllBlogs.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── CreateBlog.jsx
│   │   │   ├── EditBlog.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── UpdateProfile.jsx
│   │   │   ├── OtherProfile.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── store/               # Redux store
│   │   │   ├── features/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── blogSlice.js
│   │   │   │   ├── commentSlice.js
│   │   │   │   └── thumbnailSlice.js
│   │   │   └── store.js
│   │   │
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   └── index.js
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   ├── formatters.js
│   │   │   ├── helpers.js
│   │   │   ├── validation.js
│   │   │   └── index.js
│   │   │
│   │   ├── App.jsx              # Main App component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   │
│   ├── public/                  # Static assets
│   ├── .env.sample
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── docs/                         # Documentation
│   ├── API_REFERENCE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 💡 Usage Examples

### Creating a Blog Post

```javascript
// Frontend - CreateBlog.jsx
const formData = new FormData();
formData.append('title', 'My First Blog');
formData.append('content', '<p>Hello World!</p>');
formData.append('thumbnail', thumbnailFile);
formData.append('status', 'published');

await dispatch(createBlog(formData));
```

### Adding Comments

```javascript
// Frontend - BlogDetails.jsx
await dispatch(addComment({
  blogId: blogId,
  content: 'Great article!'
}));
```

### Email Verification

```javascript
// Backend - emailService.js
await sendVerificationEmail(user.email, verificationCode);
```

---

## 🌐 Deployment

### Deploying to Render (Backend)

1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables

### Deploying to Vercel (Frontend)

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework: Vite
   - Root Directory: `Frontend`
   - Add environment variables

For detailed deployment guides, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Nasim Reja Mondal**

- Email: rejanasim611@gmail.com
- LinkedIn: [nasim-reja-mondal](https://www.linkedin.com/in/nasim-reja-mondal-404141225/)
- GitHub: [@NasimReja077](https://github.com/NasimReja077)

**Project Link:** [https://github.com/NasimReja077/MERN-BLOG-APP](https://github.com/NasimReja077/MERN-BLOG-APP)

---

## 🙏 Acknowledgments

- [React.js Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [TinyMCE](https://www.tiny.cloud/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Shield.io](https://shields.io/) for badges

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Nasim Reja Mondal](https://github.com/NasimReja077)

</div>
