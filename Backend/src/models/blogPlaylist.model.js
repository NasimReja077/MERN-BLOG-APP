import mongoose from 'mongoose';

const blogPlaylistSchema = new mongoose.Schema({
     title: {
          type: String,
          required: [true, 'Title is required'],
          trim: true,
          maxlength: [200, 'Title cannot exceed 200 characters']
     },
     description: {
          type: String,
          maxlength: [500, 'Description cannot exceed 500 characters'],
          default: ''
     },
     blogs: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog'
     }],
     category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
          required: [true, 'Category is required']
     }, // Reference to Category model
     tags: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Tags',
          required: true
     }],
     playlistCreator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     totalBlogs: {
          type: Number,
          default: 0 // Total number of blogs in the playlist
     },

     visibility: {
          type: String,
          enum: ['public', 'private'],
          default: 'public' // Default visibility setting for the playlist
     },
     isPremium: {
          type: Boolean,
          default: false // Indicates if the playlist is premium content
     },


     // Enggement metrics

     likes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Like'
     }],
     shares: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Share'
     }], // Array of shares related to the playlist


     totalLikes: {
          type: Number,
          default: 0 // Total number of likes on the playlist
     },
     totalViews: {
          type: Number,
          default: 0 // Total number of views on the playlist
     },
     totalShares: {
          type: Number,
          default: 0 // Total number of shares of the playlist
     },


     // Status flags
     isActive: {
          type: Boolean,
          default: true
     }, // Indicates if the playlist is active
     isDeleted: {
          type: Boolean,
          default: false
     }, // Soft delete status
     deletedAt: {
          type: Date,
          default: null // Timestamp of when the playlist was deleted, if applicable
     },   

     // Placeholder for playlist logo image
     playlistLogoImage: {
          type: String,
          default: 'https://example.com/default-playlist-logo.jpg' // Placeholder URL for playlist logo image
     },
     // Placeholder for playlist cover image
     playlistCoverImage: {
          type: String,
          default: 'https://example.com/default-playlist-cover.jpg' // Placeholder URL for playlist cover image
     },
     // Placeholder for playlist thumbnail image
     playlistThumbnailImage: {
          type: String,
          default: 'https://example.com/default-playlist-thumbnail.jpg' // Placeholder URL for playlist thumbnail image
     }

}, {  timestamps: true });



blogPlaylistSchema.index({ title: 'text', tags: 'text' }); // Create a text index for search functionality
blogPlaylistSchema.index({ playlistCreator: 1, createdAt: -1 }); // Index for querying playlists by creator and creation date in descending order
blogPlaylistSchema.index({ category: 1 })

blogPlaylistSchema.pre('save', function(next){
     this.totalBlogs = this.blogs.length;
     next();
})

export const BlogPlaylist = mongoose.model('BlogPlaylist', blogPlaylistSchema);