import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({

     adminId: {
          type: mongoose.Schema.Types.ObjectId,   
          ref: 'User',
          required: true
     }, // Reference to User model for admin
     action: {
          type: String,  
          required: true,
          enum: ['approve', 'reject', 'delete', 'ban', 'unban', 'block','unblock', 'edit','feature', 'pin', 'unpin'], // Actions performed by the admin
     },
     reason: {
          type: String,
          maxlength: [500, 'Reason cannot exceed 500 characters'],
          default: ''
     },
     targetId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: 'targetType' // Dynamic reference to the model being targeted
     }, // ID of the target document (e.g., User, Blog, Comment)
     targetType: {
          type: String,
          required: true,
          enum: ['User', 'Blog', 'Comment', 'BlogPlaylist', 'Category', 'Tags']
     } // Model name of the target document  
}, {
     timestamps: true // Automatically manage createdAt and updatedAt fields
});


// Create a compound index for admin actions by targetId and action
adminSchema.index({ adminId: 1, targetType: 1, action: 1,  });

adminSchema.index({ createdAt: -1 }); // Index for sorting by createdAt in descending order

// Export the Admin model
export const Admin = mongoose.model('Admin', adminSchema);