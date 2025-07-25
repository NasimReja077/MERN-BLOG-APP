import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
     blog: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog',
          required: false
     },
     comment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment',
          required: false
     },
     playlist: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'BlogPlaylist',
          required: false
     },
     owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     }
}, {timestamps: true});

// Validation to ensure at least one target is provided
likeSchema.pre('save', function(next) {
     const targets = [this.blog, this.comment, this.playlist].filter(Boolean);
     if (targets.length !== 1) {
          return next(new Error('Exactly one target (blog, comment, or playlist) must be specified'));
     }
     next();
});

likeSchema.index({ blog: 1, owner: 1 }, { unique: true, sparse: true });
likeSchema.index({ comment: 1, owner: 1 }, { unique: true, sparse: true });

export const Like = mongoose.model('Like', likeSchema);