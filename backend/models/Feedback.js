// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    type: {
      type: String,
      enum: ['bug', 'feature', 'suggestion', 'other'],
      default: 'suggestion',
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    pageUrl: {
      type: String,
      trim: true,
    },
    userId: {
      type: String, // Clerk user ID
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'archived'],
      default: 'open',
    },
    // New fields for better tracking
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ type: 1, status: 1 });
feedbackSchema.index({ email: 1 });

// Virtual for formatted creation date
feedbackSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to mark email as sent
feedbackSchema.methods.markEmailSent = function() {
  this.emailSent = true;
  this.emailSentAt = new Date();
  return this.save();
};

// Static method to get feedback statistics
feedbackSchema.statics.getStats = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get feedback by type
feedbackSchema.statics.getByType = async function(type) {
  return this.find({ type }).sort({ createdAt: -1 });
};

// Pre-save hook to sanitize data
feedbackSchema.pre('save', function(next) {
  // Remove any HTML tags from message for security
  if (this.message) {
    this.message = this.message.replace(/<[^>]*>/g, '');
  }
  next();
});

// Avoid model overwrite issues in dev with hot reload
module.exports = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);