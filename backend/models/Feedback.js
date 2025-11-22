// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['bug', 'feature', 'suggestion', 'other'],
      default: 'suggestion',
    },
    message: {
      type: String,
      required: true,
      minlength: 5,
    },
    pageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
