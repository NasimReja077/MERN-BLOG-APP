import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platform: {
    type: String,
    enum: [
      'facebook', 'twitter', 'x', 'linkedin', 'instagram', 
      'whatsapp', 'telegram', 'discord', 'reddit', 
      'pinterest', 'tumblr', 'email', 'copy-link', 'other'
    ],
    required: true
  },
  // Additional metadata
  shareUrl: { type: String },
  referrer: { type: String }
}, { timestamps: true });

shareSchema.index({ blogId: 1, userId: 1, platform: 1 }, { unique: true });
shareSchema.index({ blogId: 1, createdAt: -1 });

export const Share = mongoose.model('Share', shareSchema);