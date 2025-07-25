import mongoose from 'mongoose';

const viewSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow anonymous views
  },
  referrer: {
    type: String,
    required: false // Track where the view came from
  },
  viewDuration: {
    type: Number,
    default: 0 // Time spent reading (in seconds)
  }
}, { timestamps: true });

// Compound index to prevent duplicate views
viewSchema.index({ blogId: 1, userId: 1 }, 
  { unique: true, sparse: true, partialFilterExpression: { userId: { $exists: true}} 
});

// For anonymous views, use IP address
viewSchema.index(
  { blogId: 1 }, 
  { unique: true, sparse: true, partialFilterExpression: { userId: { $exists: false }}
});

viewSchema.index({ blogId: 1, createdAt: -1 });


export const View = mongoose.model('View', viewSchema);