import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  contentType: {
    type: String,
    enum: {
      values: ['post', 'reel', 'qa', 'tutorial', 'lecture'],
      message: 'Content type must be post, reel, qa, tutorial, or lecture'
    },
    required: [true, 'Content type is required'],
    default: 'post'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['mathematics', 'science', 'technology', 'language', 'history', 'arts', 'business', 'other'],
    default: 'other'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in seconds for videos
    min: 0
  },
  mediaUrl: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'images', 'none'],
    default: 'none'
  },
  mediaUrls: [{
    type: String,
    trim: true
  }],
  fileSize: {
    type: Number, // in bytes
    min: 0
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  likes: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  moderationResult: {
    approved: { type: Boolean, default: true },
    reason: String,
    confidence: Number,
    reviewedAt: Date
  },
  // Q&A specific fields
  question: {
    type: String,
    trim: true
  },
  answers: [{
    text: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    isCorrect: { type: Boolean, default: false },
    votes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for answer count
postSchema.virtual('answerCount').get(function() {
  return this.answers ? this.answers.length : 0;
});

// Index for search
postSchema.index({ title: 1, description: 1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ contentType: 1, category: 1 });

export default mongoose.model('Post', postSchema);
