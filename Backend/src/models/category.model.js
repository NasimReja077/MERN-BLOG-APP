import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters'],
    unique: true,
    lowercase: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

categorySchema.index({ name: 'text', slug: 'text' });

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Category = mongoose.model('Category', categorySchema);