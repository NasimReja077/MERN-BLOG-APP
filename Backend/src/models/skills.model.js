import mongoose from 'mongoose';
import slugify from 'slugify';

const skillsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot exceed 50 characters'],
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
    required: true, // Track who created the skill
  },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

skillsSchema.index({ name: 'text', slug: 'text' });

skillsSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Skills = mongoose.model('Skills', skillsSchema);