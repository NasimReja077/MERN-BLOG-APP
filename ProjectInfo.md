# Blog API Documentation

## Environment Variables (.env)

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog_app
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
```

## Sample API Usage Documentation

### Sample Payloads for Each Endpoint

#### 1. User Registration
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "fullName": "John Doe",
  "bio": "Tech enthusiast and blogger"
}
```

**Response:**
```json
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
```

#### 2. User Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
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
```

#### 3. Create Blog Post
**POST** `/api/blogs`  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Getting Started with Node.js",
  "content": "Node.js is a powerful runtime environment...",
  "summary": "Learn the basics of Node.js development",
  "tags": ["nodejs", "javascript", "backend"],
  "category": "programming",
  "status": "published",
  "featuredImage": "https://example.com/image.jpg"
}
```

**Response:**
```json
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
```

#### 4. Get All Blogs (with Pagination and Filters)
**GET** `/api/blogs?page=1&limit=10&category=programming&sortBy=views&sortOrder=desc`

**Response:**
```json
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
```

#### 5. Track Blog View
**POST** `/api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/view`

**Request Body:**
```json
{
  "userId": "64f5a1b2c8d9e0f1a2b3c4d7"
}
```

**Response:**
```json
{
  "message": "View tracked successfully",
  "viewCount": 151,
  "uniqueViewCount": 3
}
```

#### 6. Like Blog
**POST** `/api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/like`  
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Blog liked successfully",
  "isLiked": true,
  "likeCount": 26
}
```

#### 7. Track Blog Share
**POST** `/api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/share`

**Request Body:**
```json
{
  "platform": "twitter"
}
```

**Response:**
```json
{
  "message": "Share tracked successfully",
  "shareCount": 6,
  "platformShares": [
    {"platform": "twitter", "count": 4},
    {"platform": "facebook", "count": 2}
  ]
}
```

#### 8. Add Comment to Blog
**POST** `/api/comments`  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Great article! Very helpful for beginners.",
  "blogId": "64f5a1b2c8d9e0f1a2b3c4d6"
}
```

**Response:**
```json
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
```

#### 9. Reply to Comment
**POST** `/api/comments/64f5a1b2c8d9e0f1a2b3c4d8/reply`  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Thanks for the feedback! Glad it helped."
}
```

**Response:**
```json
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
```

#### 10. Get Blog Comments
**GET** `/api/blogs/64f5a1b2c8d9e0f1a2b3c4d6/comments?page=1&limit=20`

**Response:**
```json
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
```

#### 11. Like Comment
**POST** `/api/comments/64f5a1b2c8d9e0f1a2b3c4d8/like`  
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Comment liked successfully",
  "isLiked": true,
  "likeCount": 3
}
```

#### 12. Update User Profile
**PUT** `/api/auth/profile`  
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Smith",
  "bio": "Senior Software Developer and Tech Writer",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
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
```

## Installation and Setup Instructions

1. Initialize the project:
   ```bash
   npm init -y
   npm install express mongoose bcryptjs jsonwebtoken joi cors helmet dotenv express-rate-limit
   npm install --save-dev nodemon
   ```

2. Create the folder structure:
   ```bash
   mkdir models routes middleware
   ```

3. Create all the files as shown in the code above.

4. Set up environment variables in `.env` file.

5. Start MongoDB (make sure it's running on your system).

6. Run the application:
   ```bash
   npm run dev  # for development
   npm start    # for production
   ```

## API Testing with Postman/cURL

### Example cURL Commands

#### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"securepassword123","fullName":"John Doe"}'
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securepassword123"}'
```

#### Create Blog (Replace TOKEN with Actual JWT Token)
```bash
curl -X POST http://localhost:3000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My First Blog","content":"This is my first blog post","tags":["general"]}'
```

#### Get All Blogs
```bash
curl -X GET http://localhost:3000/api/blogs
```

#### Like a Blog (Replace BLOG_ID and TOKEN)
```bash
curl -X POST http://localhost:3000/api/blogs/BLOG_ID/like \
  -H "Authorization: Bearer TOKEN"
```

---
This Markdown document is formatted for GitHub, using appropriate headers, code blocks, and lists to ensure clarity and readability. Let me know if you need further adjustments or additional sections!
