import mongoose from "mongoose";
import { Blog } from "../models/Blog.model.js";
import { Comment } from "../models/Comment.model.js";
import { User } from "../models/User.model.js";
import { CLOUDINARY_FOLDERS } from "../config/cloudinary.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../middleware/uploadHandler.js";

// Get all blogs with pagination and comments
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const commentLimit = parseInt(req.query.commentLimit) || 10; // New query param for comments
    const skip = (page - 1) * limit;
    
    const { category, tag, author, sortBy, sortOrder } = req.query;

    // Validate author ID if provided
    if (author && !mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({
        error: "Invalid author ID",
        message: "The provided author ID is not a valid MongoDB ObjectId",
      });
    }
    
    // Build filter object
    const filter = { status: 'published' };
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (author) filter.author = author;

    // Build sort object
    let sort = { createdAt: -1 }; // default sort
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'views') sort = { 'views.count': order };
      if (sortBy === 'likes') sort = { 'likes.count': order };
      if (sortBy === 'date') sort = { createdAt: order };
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username fullName avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
      // Always include comments with pagination
      const blogsWithComments = await Promise.all(
        blogs.map(async (blog) => {
          const commentPage = parseInt(req.query.commentPage) || 1;
          const commentSkip = (commentPage - 1) * commentLimit;

          const comments = await Comment.find({
            blogId: blog._id,
            parentComment: null,
            isDeleted: false,
          })
            .populate("author", "username fullName avatar")
            .populate({
              path: "replies",
              match: { isDeleted: false },
              populate: {
                path: "author",
                select: "username fullName avatar",
              },
              options: { sort: { createdAt: 1 }, limit: 5 }, // Limit replies to 5 per comment
          })
          .sort({ createdAt: -1 })
          .skip(commentSkip)
          .limit(commentLimit);

        const totalComments = await Comment.countDocuments({
          blogId: blog._id,
          parentComment: null,
          isDeleted: false,
        });

        return {
          ...blog.toObject(),
          comments,
          commentsCount: totalComments,
          commentPagination: {
            currentPage: commentPage,
            totalPages: Math.ceil(totalComments / commentLimit),
            totalComments,
            hasNext: commentPage < Math.ceil(totalComments / commentLimit),
            hasPrev: commentPage > 1,
          },
        };
      })
    );

    const totalBlogs = await Blog.countDocuments(filter);

    res.json({
      blogs: blogsWithComments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
        hasNext: page < Math.ceil(totalBlogs / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAllBlogs:", error.message);
    res.status(500).json({
      error: "Failed to fetch blogs",
      message: error.message,
    });
  }
};

// Get blogs by user
export const getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const commentLimit = parseInt(req.query.commentLimit) || 10;
    const skip = (page - 1) * limit;
    const { status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "The provided userId is not a valid MongoDB ObjectId",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: `No user found with ID: ${userId}`,
      });
    }

    const filter = { author: userId };
    if (status) filter.status = status;

    const blogs = await Blog.find(filter)
      .populate("author", "username fullName avatar address mobile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const blogsWithComments = await Promise.all(
      blogs.map(async (blog) => {
        const commentPage = parseInt(req.query.commentPage) || 1;
        const commentSkip = (commentPage - 1) * commentLimit;

        const comments = await Comment.find({
          blogId: blog._id,
          parentComment: null,
          isDeleted: false,
        })
          .populate("author", "username fullName avatar")
          .populate({
            path: "replies",
            match: { isDeleted: false },
            populate: {
              path: "author",
              select: "username fullName avatar",
            },
            options: { sort: { createdAt: 1 }, limit: 5 },
          })
          .sort({ createdAt: -1 })
          .skip(commentSkip)
          .limit(commentLimit);

        const totalComments = await Comment.countDocuments({
          blogId: blog._id,
          parentComment: null,
          isDeleted: false,
        });

        return {
          ...blog.toObject(),
          comments,
          commentsCount: totalComments,
          commentPagination: {
            currentPage: commentPage,
            totalPages: Math.ceil(totalComments / commentLimit),
            totalComments,
            hasNext: commentPage < Math.ceil(totalComments / commentLimit),
            hasPrev: commentPage > 1,
          },
        };
      })
    );

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs: blogsWithComments,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getBlogsByUser:", error.message);
    res.status(500).json({
      error: "Failed to fetch blogs",
      message: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username fullName avatar bio"
    );

    if (!blog || blog.status !== "published") {
      return res.status(404).json({
        error: "Blog not found or not published",
        message: "The requested blog is either unpublished or does not exist",
      });
    }

    const commentPage = parseInt(req.query.commentPage) || 1;
    const commentLimit = parseInt(req.query.commentLimit) || 10;
    const commentSkip = (commentPage - 1) * commentLimit;

    const comments = await Comment.find({
      blogId: blog._id,
      parentComment: null,
      isDeleted: false,
    })
      .populate("author", "username fullName avatar")
      .populate({
        path: "replies",
        match: { isDeleted: false },
        populate: {
          path: "author",
          select: "username fullName avatar",
        },
        options: { sort: { createdAt: 1 }, limit: 5 },
      })
      .sort({ createdAt: -1 })
      .skip(commentSkip)
      .limit(commentLimit);

    const commentsCount = await Comment.countDocuments({
      blogId: blog._id,
      parentComment: null,
      isDeleted: false,
    });

    res.json({
      blog: {
        ...blog.toObject(),
        comments,
        commentsCount,
        commentPagination: {
          currentPage: commentPage,
          totalPages: Math.ceil(commentsCount / commentLimit),
          totalComments: commentsCount,
          hasNext: commentPage < Math.ceil(commentsCount / commentLimit),
          hasPrev: commentPage > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error in getBlogById:", error.message);
    res.status(500).json({
      error: "Failed to fetch blog",
      message: error.message,
    });
  }
};

// Create new blog
export const createBlog = async (req, res) => {
  try {
    let thumbnailUrl = null;
    let contentImagesUrls = [];

    // Handle thumbnail upload
    if(req.files?.thumbnail?.[0]){
      const thumbnailUpload = await uploadToCloudinary(req.files.thumbnail[0], CLOUDINARY_FOLDERS.BLOG_THUMBNAILS);
      thumbnailUrl = thumbnailUpload.url;
    } else if(req.body.thumbnail){
      thumbnailUrl = req.body.thumbnail;
    }
    // Handle content images upload (up to 10)

    if(req.files?.contentImages){
      if(req.files.contentImages.length > 10){
        return res.status(400).join({
          error: "Too many content images",
          message: "Maximum 10 content images allowed",
        });
      }

      for (const file of req.files.contentImages){
        const imageUpload = await uploadContentThumbnail(file, CLOUDINARY_FOLDERS.BLOG_CONTENT)
        contentImagesUrls.push(imageUpload.url);
      }
    }else if(req.body.contentImages){
      contentImagesUrls = Array.isArray(req.body.contentImages) ? req.body.contentImages : [req.body.contentImages];
      if (contentImagesUrls.length > 10){
        return res.status(400).join({
          error: "Too many content images",
          message: "Maximum 10 content images allowed",
        })
      }
    }
      const blogData = {
        ...req.body,
        author: req.user._id,
        thumbnail: thumbnailUrl,
        contentImages: contentImagesUrls,
        tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(",").map(tag => tag.trim()): []),
      };
      console.log("Blog data:", blogData);

      const blog = new Blog(blogData);
      await blog.save();

      await blog.populate("author", "username fullName avatar");

      res.status(201).json({
        message: "Blog created successfully",
        blog,
      });
    } catch (error) {
     console.error("Error in createBlog:", error.message);
      res.status(500).json({
        error: "Failed to create blog",
        message: error.message,
      });
  }
};


export const uploadContentThumbnail = async(req, res) =>{
  //file uplod or not
  // Get current user
  // Upload new thumbnail Image
  // Delete old thumbnail image if exists
  // Update user with new thumbnail image URL
  try {
     console.log('req.params:', req.params); // Debug params
    console.log('req.file:', req.file); //Debug
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
        message: "Please select an image file to upload",
      });
    }

// find blog by id
    const blog = await Blog.findById(req.params.id);
    if(!blog){
      console.log('Blog not found for id:', req.params.id); // Debug
      return res.status(404).json({error: "Blog not Found"});
    }

    console.log('req.user._id:', req.user._id); // Debug user
    console.log('blog.author:', blog.author); // Debug author

    // check if user is the author of the blog
    if(blog.author.toString() !== req.user._id.toString()){
      return res.status(403).json({
        error: "Access Denied",
        message: "You can only upload thumbnail for your own blog",
      });
    };

    // Delete old thumbnail if it exists
    if (blog.thumbnail) {
      const urlParts = blog.thumbnail.split("/");
      const publicId = urlParts.slice(urlParts.length - 2).join("/").split(".")[0];
      console.log('Deleting old thumbnail with publicId:', publicId); // Debug
      await deleteFromCloudinary(publicId);
    }
      // Upload new thumbnail
      const blogThumbnailsUpload = await uploadToCloudinary(req.file, CLOUDINARY_FOLDERS.BLOG_THUMBNAILS);

      // Update blog with new thumbnail URL
      blog.thumbnail = blogThumbnailsUpload.url;
      await blog.save();

      res.json({
      message: "Thumbnail uploaded successfully",
      blog: blog.toJSON(),
    });

  } catch (error) {
    console.error("Error in uploadThumbnailHandler:", error.message);
    res.status(500).json({
      error: "Failed to upload thumbnail",
      message: error.message,
    });
  }
}

export const uploadContentImages = async (req, res) => {
  try {
    console.log('req.files:', req.files); // Debug

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "No files uploaded",
        message: "Please select at least one image file to upload",
      });
    }

    if (req.files.length > 10){
      return res.status(400).join({
        error: "Too many content images",
        message: "Maximum 10 content images allowed",
      })
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own blog content images'
      });
    }

    // upload mew content images
    const contentImageUrls = [];
    for (const file of req.files) {
      const imageUpload = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.BLOG_CONTENT);
      contentImageUrls.push(imageUpload.url);
    }
    // Update blog with new content images
    blog.contentImages = [...(blog.contentImages || []), ...contentImageUrls];
    if(blog.contentImages.length > 10){
      return res.status(400).json({
        error: "Too many content images",
        message: "Maximum 10 content images allowed",
      });
    }
    await blog.save();
    req.json({
      message: "Content images uploaded successfully",
      blog: blog.toJSON(),
    });
  } catch (error) {
    console.error("Error in uploadContentImages:", error.message);
    res.status(500).json({
      error: "Failed to upload content images",
      message: error.message,
    });
  }
  };


export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own blogs'
      });
    }

    let thumbnailUrl = blog.thumbnail;
    let contentImagesUrls = blog.contentImages || [];


    // Handle thumbnail upload or update
    if(res.files?.thumbnail?.[0]){
      if (blog.thumbnail) {
        const publicId = blog.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.BLOG_THUMBNAILS}/${publicId}`);
      }
      const thumbnailUpload = await uploadToCloudinary(req.files.thumbnail[0], CLOUDINARY_FOLDERS.BLOG_THUMBNAILS);
      thumbnailUrl = thumbnailUpload.url;
    }else if(req.body.thumbnail){
      thumbnailUrl = req.body.thumbnail;
    }

    // Handle content images upload or update
    if(req.files?.contentImages){
      if(req.files.contentImages.length > 10){
        return res.status(400).join({
          error: "Too many content images",
          message: "Maximum 10 content images allowed",
        });
      }
      // Delete old content images
      if(contentImagesUrls.length > 0){
        for (const imageUrl of blog.contentImages){
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.BLOG_CONTENT}/${publicId}`);
        }
      }
      contentImagesUrls = [];
      for(const file of req.files.contentImages){
        const imageUpload = await uploadToCloudinary(file, CLOUDINARY_FOLDERS.BLOG_CONTENT);
        contentImagesUrls.push(imageUpload.url);
      }
    }else if(req.body.contentImages){
      contentImagesUrls = Array.isArray(req.body.contentImages) ? req.body.contentImages : [req.body.contentImages];
      if (contentImagesUrls.length > 10){
        return res.status(400).json({
          error: "Too Many content images",
          message: "Maximum 10 content images allowed",
        });
      }
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        thumbnail: thumbnailUrl,
        contentImages: contentImagesUrls,
      },
      {new: true, runValidators: true}
    ).populate('author', 'username fullName avatar');

     res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update blog',
      message: error.message
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own blogs'
      });
    }

    // Delete thumbnail if exists
    if(blog.thumbnail){
      const publicId = blog.thumbnail.split("/").pop().split(".")[0];
      await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.BLOG_THUMBNAILS}/${publicId}`);
    }

    // Delete content images if exist
    if(blog.contentImages && blog.contentImages.length > 0){
      for(const imageUrl of blog.contentImages){
        const publicId = imageUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(`${CLOUDINARY_FOLDERS.BLOG_CONTENT}/${publicId}`);
      }
    }

    await Blog.findByIdAndDelete(req.params.id); 
    // Delete all comments for this blog
    await Comment.deleteMany({ blogId: req.params.id });
    
    res.json({
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete blog',
      message: error.message
    });
  }
};

// Track blog view
export const trackBlogView = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.body.userId; // Optional: track unique views
    
    const updateQuery = { $inc: { 'views.count': 1 } };
    
    // If userId provided, add to uniqueUsers array if not already present
    if (userId) {
      updateQuery.$addToSet = { 'views.uniqueUsers': userId };
    }

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      updateQuery,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    res.json({
      message: 'View tracked successfully',
      viewCount: blog.views.count,
      uniqueViewCount: blog.views.uniqueUsers.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to track view',
      message: error.message
    });
  }
};

// Like/Unlike blog
export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    const hasLiked = blog.likes.users.includes(userId);
    
    let updateQuery;
    let message;
    
    if (hasLiked) {
      // Unlike
      updateQuery = {
        $pull: { 'likes.users': userId },
        $inc: { 'likes.count': -1 }
      };
      message = 'Blog unliked successfully';
    } else {
      // Like
      updateQuery = {
        $addToSet: { 'likes.users': userId },
        $inc: { 'likes.count': 1 }
      };
      message = 'Blog liked successfully';
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateQuery,
      { new: true }
    );

    res.json({
      message,
      isLiked: !hasLiked,
      likeCount: updatedBlog.likes.count
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process like',
      message: error.message
    });
  }
};

// Track blog share
export const trackBlogShare = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { platform } = req.body;

    const validPlatforms = ['Facebook', 'Twitter', 'Linkedin', 'Instagram','Whatsapp', 'Other'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({
        error: 'Invalid platform',
        message: `Platform must be one of: ${validPlatforms.join(', ')}`
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Find existing platform or create new one
    const platformIndex = blog.shares.platforms.findIndex(p => p.platform === platform);
    
    let updateQuery;
    if (platformIndex >= 0) {
      // Increment existing platform count
      updateQuery = {
        $inc: { 
          'shares.count': 1,
          [`shares.platforms.${platformIndex}.count`]: 1 
        }
      };
    } else {
      // Add new platform
      updateQuery = {
        $inc: { 'shares.count': 1 },
        $push: { 'shares.platforms': { platform, count: 1 } }
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      updateQuery,
      { new: true }
    );

    res.json({
      message: 'Share tracked successfully',
      shareCount: updatedBlog.shares.count,
      platformShares: updatedBlog.shares.platforms
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to track share',
      message: error.message
    });
  }
};