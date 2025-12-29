// Frontend/src/components/constants/index.js

// API Configuration
export const API_TIMEOUT = 10000; // 10 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// OTP / Verification
export const OTP_TIMEOUT = 180; // seconds (3 minutes)

// Blog Status
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
};

// Sort Options
export const SORT_OPTIONS = {
  DATE_DESC: 'date',
  DATE_ASC: 'date',
  LIKES_DESC: 'likes',
  VIEWS_DESC: 'views',
};

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// File Size Limits (in bytes)
export const MAX_FILE_SIZE = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  COVER_IMAGE: 5 * 1024 * 1024, // 5MB
  BLOG_THUMBNAIL: 5 * 1024 * 1024, // 5MB
  CONTENT_IMAGE: 5 * 1024 * 1024, // 5MB
};

// Allowed File Types
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Form Field Limits
export const FIELD_LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
  PASSWORD_MIN: 6,
  FULLNAME_MAX: 100,
  BIO_MAX: 500,
  ADDRESS_MAX: 200,
  MOBILE_LENGTH: 10,
  AADHAR_LENGTH: 12,
  OTP_LENGTH: 6,
  BLOG_TITLE_MAX: 200,
  BLOG_SUMMARY_MAX: 500,
  COMMENT_MAX: 1000,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  BLOGS: '/blogs',
  BLOG_DETAILS: '/blogs/:id',
  CREATE_BLOG: '/blogs/create',
  EDIT_BLOG: '/blogs/edit/:id',
  PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/update',
  OTHER_PROFILE: '/other-user-profile/:id',
};

// Toast Messages
export const TOAST_MESSAGES = {
  // Auth
  REGISTRATION_SUCCESS: 'Registration successful! Please verify your email.',
  EMAIL_VERIFIED: 'Email verified successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged-Out Successfully',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_RESET_LINK_SENT: 'Password reset link sent to your email',
  PASSWORD_RESET_LINK_SENT_FAILED: 'Failed to send reset email',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully! You can now log in.',
  
  // Blog
  BLOG_CREATED: 'Blog Created Successfully!',
  BLOG_UPDATED: 'Blog Updated Successfully!',
  BLOG_DELETED: 'Blog Deleted Successfully!',
  
  // Comment
  COMMENT_ADDED: 'Comment added Successfully!',
  COMMENT_UPDATED: 'Comment updated successfully!',
  COMMENT_DELETED: 'comment deleted Successfully!',
  REPLY_ADDED: 'Reply add Successfully!',
  
  // OTP / Verification
  OTP_RESEND_SUCCESS: 'New OTP sent to your email!',
  OTP_RESEND_FAILED: 'Failed to resend OTP',

  // Errors
  REGISTRATION_FAILED: 'Registration failed',
  VERIFICATION_FAILED: 'Verification failed',
  LOGIN_FAILED: 'Login failed',
  UPDATE_FAILED: 'Update failed',
  PASSWORD_RESET_FAILED: 'Password reset failed',
  BLOG_CREATE_FAILED: 'Failed to Create Blog',
  BLOG_UPDATE_FAILED: 'Failed to update blog',
  BLOG_DELETE_FAILED: 'Failed to delete blog',
  COMMENT_ADD_FAILED: 'Failed to Add comment',
  BLOG_LOAD_FAILED: 'Failed to load blogs',

  // Likes 
  // viewes
  // shares
  
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
};

