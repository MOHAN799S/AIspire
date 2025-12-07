// models/User.js - Complete MongoDB User Schema
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores and hyphens'
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email address'
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
    },
    // Optional: Add more fields as needed
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// ============================================
// Indexes for better query performance
// ============================================
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

// ============================================
// Instance Methods
// ============================================

// Method to get user object without sensitive data
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
  };
};

// ============================================
// Static Methods
// ============================================

// Find user by email (including password for login)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password');
};

// Find user by username (including password)
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username }).select('+password');
};

// Find active users
userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

// ============================================
// Virtual Properties
// ============================================

// Virtual property for user's ID as string
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// ============================================
// Middleware Hooks
// ============================================

// Pre-save hook
userSchema.pre('save', function (next) {
  // Only validate password if it's new or modified
  if (this.isModified('password') && this.password.length < 6) {
    return next(new Error('Password must be at least 6 characters'));
  }
  next();
});

// Pre-save hook to update lastLogin
userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

// ============================================
// Export Model
// ============================================
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;