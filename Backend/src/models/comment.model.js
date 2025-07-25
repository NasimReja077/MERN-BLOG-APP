import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
     content: {          
          type: String,
          required: [true, 'Content is required'],
          trim: true
     },
     blog: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog',
          required: true
     }, // Reference to the Blog model

     // blogId: {
     //      type: mongoose.Schema.Types.ObjectId,
     //      ref: 'Blog',
     //      required: true

     // },
     owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     likes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Like'
     }],

     likesNumber: { type: Number, default: 0 },
     isEdited: { type: Boolean, default: false },
     isDeleted: { type: Boolean, default: false },
     parentComment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment',
          default: null
     },
     // Nested replies for better threading
     replies: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment'
     }],
     level: {
          type: Number,
          default: 0,
          max: 100 // Limit nesting depth
     }

}, { timestamps: true });


// Index for performance
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ owner: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ content: 'text' });


// Virtuals for additional functionality
commentSchema.virtual('replyCount').get(function() {
     return this.replies ? this.replies.length : 0;
});

commentSchema.virtual('likesCount').get(function() {
     return this.likes ? this.likes.length : 0;
});

// Pre-save hook to update likesNumber
commentSchema.set('toJSON', { virtuals: true });

// export the Comment model
export const Comment = mongoose.model('Comment', commentSchema);
