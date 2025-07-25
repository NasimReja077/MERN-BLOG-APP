import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import slugify from 'slugify';
import sanitizeHtml from 'sanitize-html';


const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'audio', 'gif', 'document', 'link', 'embed', 'code', 'text', 'excel', 'ppt', 'zip', 'svg', 'webp', 'mp3', 'mp4', 'pdf'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  filename: {type: String},
  size: {type: Number},
  duration: {type: Number}, // for video/audio
  thumbnailUrl: {type: String}, // for video
  alt: {type: String}, // for images
  caption: {type: String}
},{_id: false, timestamps: true});// Set _id to false if don't need individual _id for subdocuments

const blogSchema = new mongoose.Schema({
     title: {
          type: String,
          required: [true, 'Title is required'],
          trim: true,
          maxlength: [200, 'Title cannot exceed 200 characters']
     },
     content: {
          type: String,
          required: [true, 'Content is required'],
          trim: true,
          // text: true ,// Enable text search on content
     },
     heroBannerImage: {
          type: String,
          required: [true, 'Blog cover image is required'],
          default: 'https://flowbite.com/docs/images/blog/image-1.jpg'
     },
     summary: {
          type: String,
          maxlength: [600, 'Summary cannot exceed 600 characters'],
          default: ''
     },
     visibility: {
          type: String,
          enum: ['public', 'private', 'premium'],
          default: 'public',
     },
     views: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'View'
     }],
     likes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Like'
     }],
     shares: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Share'
     }],
     comments: [{   
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment'
     }],

     // Counter fields for performance
     viewsNumber: { type: Number, default: 0 },
     likesNumber: { type: Number, default: 0 },
     sharesNumber: { type: Number, default: 0 },
     commentsNumber: { type: Number, default: 0 },

     // Approval system
     isApproved: { type: Boolean, default: false },
     approvedBy: {
          type: mongoose.Schema.Types.ObjectId,   
          ref: 'User',
          default: null
     },

     // Publishing and status fields
     publishedAt:{
          type: Date,
          default: null // Will be set when the blog is published
     },
     slug: {
          type: String,  
          unique: true,
          sparse: true, //
     },  

     // SEO fields
     seo: {
          metaTitle: { type: String, default: '' },
          metaDescription: { type: String, default: '' },
          metaKeywords: { type: [String], default: [] },
     },

     // Status and lifecycle fields
     status: {
          type: String,
          enum: ['draft', 'pending', 'published', 'rejected', 'archived', 'deleted'],
          default: 'draft'
     },


     // Date fields
     publishedDate: { type: Date, default: null },
     archivedDate: { type: Date, default: null },
     lastUpdated: { type: Date, default: Date.now },


     // Boolean flags - FIXED: Removed duplicates
     isFeatured: { type: Boolean, default: false },
     isPinned: { type: Boolean, default: false },
     isDeleted: { type: Boolean, default: false },
     isActive: { type: Boolean, default: true },
     isDraft: { type: Boolean, default: true },
     isPublished: { type: Boolean, default: false },
     isArchived: { type: Boolean, default: false },
     isPublic: { type: Boolean, default: true },
     isPrivate: { type: Boolean, default: false },



     author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     tags: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tags'
     }],
     // Reference to Tag model

     category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: [true, 'Category is required']
     }, // Reference to Category model

    skills: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill'
    }], // Array of skills related to the blog

     readingTime: {
          type: Number,
          default: 0 // Estimated reading time in minutes
     }, // Estimated reading time in minutes
     media: [mediaSchema], // Array of media objects associated with the blog
     featuredImage: {
          type: String,
          default: null // Placeholder URL for featured image
     },
     readTime: {
          type: Number, // Estimated read time in minutes
          default: 1 // Default read time is 1 minute
     },
},{ timestamps: true }
);

blogSchema.index({ title: 'text', 'seo.metaKeywords': 'text' }); // Text index for full-text search on title, content, and tags
blogSchema.index({ author: 1, status: 1 }); // Index for author and status for faster queries
blogSchema.index({ publishedAt: -1 }); // Index for publishedAt for sorting by latest blogs
blogSchema.index({ category: 1 }); // Index for category for faster category-based queries
blogSchema.index({ tags: 1 }); // Index for tags for faster tag-based queries
blogSchema.index({ skills: 1 }); // Index for skills for faster skill-based queries


// pre-save hook
blogSchema.pre('save', function(next) {
     if (this.isModified('title')) {
          this.slug = slugify(this.title, { lower: true, strict: true });
     }

     if( this.isModified('content')) {
          const plainText = sanitizeHtml(this.content, { allowedTags: [], allowedAttributes: {} });
          const wordCount = plainText.trim().split(/\s+/).length;
          this.readingTime = Math.ceil(wordCount / 200); // Assuming average reading speed of 200 words per minute
          this.readTime = this.readingTime; // Set readTime to readingTime
     }
     this.lastUpdated = Date.now();
     next();
});
// Adding pagination support to the blog schema
blogSchema.plugin(mongooseAggregatePaginate);

// Export the Blog model
export const Blog = mongoose.model('Blog', blogSchema);