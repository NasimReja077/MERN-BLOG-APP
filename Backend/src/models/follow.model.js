import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
     follower: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     following: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     },
     status: {
          type: String,
          enum: ['active', 'blocked', 'muted'],
          default: 'active'
     }
}, { timestamps: true });

// Prevent self-following
followSchema.pre('save', function(next) {
     if (this.follower.equals(this.following)) {
          return next(new Error('Users cannot follow themselves'));
     }
     next();
});



// Index for performance
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1 }); 
followSchema.index({ follower: 1 });
// export the Follow model
export const Follow = mongoose.model('Follow', followSchema);