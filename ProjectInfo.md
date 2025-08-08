/ .env file
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog_app
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure

// Sample API Usage Documentation

/*
==============================================
SAMPLE PAYLOADS FOR EACH ENDPOINT
==============================================

1. USER REGISTRATION
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "bio": "Tech enthusiast and blogger"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "bio": "Tech enthusiast and blogger",
    "avatar": null,
    "createdAt": "2023-09-04T10:30:00.000Z",
    "updatedAt": "2023-09-04T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

2. USER LOGIN
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

3. CREATE BLOG POST
POST /api/blogs
Headers: Authorization: Bearer <token>
{
  "title": "Getting Started with Node.js",
  "content": "Node.js is a powerful runtime environment...",
  "summary": "Learn the basics of Node.js development",
  "tags": ["nodejs", "javascript", "backend"],
  "category": "programming",
  "status": "published",
  "featuredImage": "https://example.com/image.jpg"
}

Response:
{
  "message": "Blog created successfully",
  "blog": {
    "_id": "64f5a1b2c8d9e0f1a2b3c4d6",
    "title": "Getting Started with Node.js",
    "content": "Node.js is a powerful runtime environment...",
    "summary": "Learn the basics of Node.js development",
    "author": {
      "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": null
    },
    "tags": ["nodejs", "javascript", "backend"],
    "category": "programming",
    "status": "published",
    "featuredImage": "https://example.com/image.jpg",
    "views": {
      "count": 0,
      "uniqueUsers": []
    },
    "likes": {
      "count": 0,
      "users": []
    },
    "shares": {
      "count": 0,
      "platforms": []
    },
    "createdAt": "2023-09-04T10:35:00.000Z",
    "updatedAt": "2023-09-04T10:35:00.000Z"
  }
}

4. GET ALL BLOGS (with pagination and filters)
GET /api/blogs?page=1&limit=10&category=programming&sortBy=views&sortOrder=desc

Response:
{
  "blogs": [
    {
      "_id": "64f5a1b2c8d9e0f1a2b3c4d6",
      "title": "Getting Started with Node.js",
      "summary": "Learn the basics of Node.js development",
      "author": {
        "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
        "username": "johndoe",
        "fullName": "John Doe",
        "avatar": null
      },
      "tags": ["nodejs", "javascript", "backend"],
      "category": "programming",
      "views": {
        "count": 150,
        "uniqueUsers": ["user1", "user2"]
      },
      "likes": {
        "count": 25,
        "users": ["user1", "user3"]
      },
      "shares": {
        "count": 5,
        "platforms": [
          {"platform": "twitter", "count": 3},
          {"platform": "facebook", "count": 2}
        ]
      },
      "createdAt": "2023-09-04T10:35:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalBlogs": 25,
    "hasNext": true,
    "hasPrev": false
  }
}

5. TRACK BLOG VIEW
POST /api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/view
{
  "userId": "64f5a1b2c8d9e0f1a2b3c4d7"
}

Response:
{
  "message": "View tracked successfully",
  "viewCount": 151,
  "uniqueViewCount": 3
}

6. LIKE BLOG
POST /api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/like
Headers: Authorization: Bearer <token>

Response:
{
  "message": "Blog liked successfully",
  "isLiked": true,
  "likeCount": 26
}

7. TRACK BLOG SHARE
POST /api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/share
{
  "platform": "twitter"
}

Response:
{
  "message": "Share tracked successfully",
  "shareCount": 6,
  "platformShares": [
    {"platform": "twitter", "count": 4},
    {"platform": "facebook", "count": 2}
  ]
}

8. ADD COMMENT TO BLOG
POST /api/comments
Headers: Authorization: Bearer <token>
{
  "content": "Great article! Very helpful for beginners.",
  "blogId": "64f5a1b2c8d9e0f1a2b3c4d6"
}

Response:
{
  "message": "Comment added successfully",
  "comment": {
    "_id": "64f5a1b2c8d9e0f1a2b3c4d8",
    "blogId": "64f5a1b2c8d9e0f1a2b3c4d6",
    "author": {
      "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": null
    },
    "content": "Great article! Very helpful for beginners.",
    "parentComment": null,
    "likes": {
      "count": 0,
      "users": []
    },
    "replies": [],
    "isDeleted": false,
    "createdAt": "2023-09-04T10:40:00.000Z",
    "updatedAt": "2023-09-04T10:40:00.000Z"
  }
}

9. REPLY TO COMMENT
POST /api/comments/64f5a1b2c8d9e0f1a2b3c4d8/reply
Headers: Authorization: Bearer <token>
{
  "content": "Thanks for the feedback! Glad it helped."
}

Response:
{
  "message": "Reply added successfully",
  "reply": {
    "_id": "64f5a1b2c8d9e0f1a2b3c4d9",
    "blogId": "64f5a1b2c8d9e0f1a2b3c4d6",
    "author": {
      "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": null
    },
    "content": "Thanks for the feedback! Glad it helped.",
    "parentComment": "64f5a1b2c8d9e0f1a2b3c4d8",
    "likes": {
      "count": 0,
      "users": []
    },
    "replies": [],
    "isDeleted": false,
    "createdAt": "2023-09-04T10:42:00.000Z",
    "updatedAt": "2023-09-04T10:42:00.000Z"
  }
}

10. GET BLOG COMMENTS
GET /api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/comments?page=1&limit=20

Response:
{
  "comments": [
    {
      "_id": "64f5a1b2c8d9e0f1a2b3c4d8",
      "blogId": "64f5a1b2c8d9e0f1a2b3c4d6",
      "author": {
        "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
        "username": "johndoe",
        "fullName": "John Doe",
        "avatar": null
      },
      "content": "Great article! Very helpful for beginners.",
      "parentComment": null,
      "likes": {
        "count": 2,
        "users": ["user1", "user2"]
      },
      "replies": [
        {
          "_id": "64f5a1b2c8d9e0f1a2b3c4d9",
          "author": {
            "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
            "username": "johndoe",
            "fullName": "John Doe",
            "avatar": null
          },
          "content": "Thanks for the feedback! Glad it helped.",
          "createdAt": "2023-09-04T10:42:00.000Z"
        }
      ],
      "createdAt": "2023-09-04T10:40:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalComments": 5,
    "hasNext": false,
    "hasPrev": false
  }
}

11. LIKE COMMENT
POST /api/comments/64f5a1b2c8d9e0f1a2b3c4d8/like
Headers: Authorization: Bearer <token>

Response:
{
  "message": "Comment liked successfully",
  "isLiked": true,
  "likeCount": 3
}

12. UPDATE USER PROFILE
PUT /api/auth/profile
Headers: Authorization: Bearer <token>
{
  "fullName": "John Smith",
  "bio": "Senior Software Developer and Tech Writer",
  "avatar": "https://example.com/avatar.jpg"
}

Response:
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "64f5a1b2c8d9e0f1a2b3c4d5",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Smith",
    "bio": "Senior Software Developer and Tech Writer",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2023-09-04T10:30:00.000Z",
    "updatedAt": "2023-09-04T10:45:00.000Z"
  }
}

==============================================
INSTALLATION AND SETUP INSTRUCTIONS
==============================================

1. Initialize the project:
   npm init -y
   npm install express mongoose bcryptjs jsonwebtoken joi cors helmet dotenv express-rate-limit
   npm install --save-dev nodemon

2. Create the folder structure:
   mkdir models routes middleware
   
3. Create all the files as shown in the code above

4. Set up environment variables in .env file

5. Start MongoDB (make sure it's running on your system)

6. Run the application:
   npm run dev (for development)
   npm start (for production)

==============================================
API TESTING WITH POSTMAN/CURL
==============================================

Example CURL commands:

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"securepassword123","fullName":"John Doe"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securepassword123"}'

# Create blog (replace TOKEN with actual JWT token)
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My First Blog","content":"This is my first blog post","tags":["general"]}'

# Get all blogs
curl -X GET http://localhost:3000/api/blogs

# Like a blog (replace BLOG_ID and TOKEN)
curl -X POST http://localhost:3000/api/blogs/BLOG_ID/like \
  -H "Authorization: Bearer TOKEN"
