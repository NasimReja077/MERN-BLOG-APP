import mongoose from 'mongoose';
import slugify from 'slugify';

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    trim: true,
    maxlength: [30, 'Tag name cannot exceed 30 characters'],
    unique: true,
    lowercase: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

tagsSchema.index({ name: 'text', slug: 'text' });

tagsSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Tags = mongoose.model('Tags', tagsSchema);