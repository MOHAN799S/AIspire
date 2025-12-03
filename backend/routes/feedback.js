// routes/feedback.js
const express = require('express');
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const {
  sendFeedbackNotification,
  sendUserThankYouEmail,
} = require('../config/email');

const router = express.Router();

/**
 * GET /api/feedback
 * Fetch all feedback entries with optional filters
 */
router.get('/', async (req, res) => {
  try {
    console.log('Mongo readyState (GET /api/feedback):', mongoose.connection.readyState);
    
    const { status, type, userId, limit = 100 } = req.query;
    
    // Build filter query
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (userId) filter.userId = userId;

    const feedbacks = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ 
      message: 'Failed to fetch feedback',
      error: err.message 
    });
  }
});

/**
 * GET /api/feedback/stats
 * Get feedback statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await Feedback.getStats();
    
    const total = await Feedback.countDocuments();
    const byType = await Feedback.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      total,
      byStatus: stats,
      byType,
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: err.message 
    });
  }
});

/**
 * GET /api/feedback/:id
 * Get a single feedback by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json(feedback);
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ 
      message: 'Failed to fetch feedback',
      error: err.message 
    });
  }
});

/**
 * POST /api/feedback
 * Create new feedback with comprehensive validation
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, type, message, pageUrl, userId } = req.body;

    // ---------- 1. Normalize ----------
    const cleanedName = (name ?? '').trim();
    const cleanedEmail = (email ?? '').trim().toLowerCase();
    const cleanedMessage = (message ?? '').trim();
    const cleanedPageUrl = (pageUrl ?? '').trim();
    const cleanedUserId = (userId ?? '').trim();

    const errors = [];

    // ---------- 2. Validation ----------
    if (!cleanedName) errors.push('Name is required');
    else if (cleanedName.length < 2) errors.push('Name must be at least 2 characters');
    else if (cleanedName.length > 100) errors.push('Name must be less than 100 characters');

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!cleanedEmail) errors.push('Email is required');
    else if (!emailRegex.test(cleanedEmail)) errors.push('Please provide a valid email address');
    else if (cleanedEmail.length > 160) errors.push('Email must be less than 160 characters');

    if (!cleanedMessage) errors.push('Message is required');
    else if (cleanedMessage.length < 10) errors.push('Message must be at least 10 characters');
    else if (cleanedMessage.length > 5000) errors.push('Message must be less than 5000 characters');

    const validTypes = ['bug', 'feature', 'suggestion', 'other'];
    const feedbackType = validTypes.includes(type) ? type : 'suggestion';

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }

    // ---------- 3. Meta ----------
    const userAgent = req.headers['user-agent'] || '';
    const ipHeader =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '';
    const ipAddress = Array.isArray(ipHeader)
      ? ipHeader[0]
      : ipHeader.split(',')[0].trim();

    // ---------- 4. Save Feedback ----------
    const feedbackData = {
      name: cleanedName,
      email: cleanedEmail,
      type: feedbackType,
      message: cleanedMessage,
      pageUrl: cleanedPageUrl,
      userId: cleanedUserId,
      userAgent,
      ipAddress,
    };

    const savedFeedback = await Feedback.create(feedbackData);

    // ---------- 5. Email Sending ----------
    let adminMailInfo = null;
    try {
      adminMailInfo = await sendFeedbackNotification(savedFeedback);
    } catch (err) {
      console.error('Admin notification failed:', err);
    }

    if (adminMailInfo) {
      try {
        await sendUserThankYouEmail(savedFeedback);
      } catch (err) {
        console.error('User thank-you email failed:', err);
      }
    }

    try {
      if (typeof savedFeedback.markEmailSent === 'function') {
        await savedFeedback.markEmailSent();
      }
    } catch (err) {
      console.error('Failed to mark email sent:', err);
    }

    // ---------- 6. Response ----------
    return res.status(201).json({
      success: true,
      message: "Thank you for your feedback! We've received your message.",
      feedback: {
        id: savedFeedback._id,
        type: savedFeedback.type,
        status: savedFeedback.status,
        createdAt: savedFeedback.createdAt,
      },
    });
  } catch (err) {
    console.error('Error in /api/feedback:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(err.errors).map(e => e.message),
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Duplicate feedback submission detected',
        error: 'This feedback has already been submitted',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while submitting feedback',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
  }
});


/**
 * PATCH /api/feedback/:id
 * Update feedback status, priority, or admin notes
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    // Build update object
    const updateData = {};
    if (status) {
      const validStatuses = ['open', 'in_progress', 'resolved', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      updateData.status = status;
    }
    if (priority) {
      const validPriorities = ['low', 'medium', 'high', 'critical'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value' });
      }
      updateData.priority = priority;
    }
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes.trim();
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback updated successfully',
      feedback: updatedFeedback
    });
    console.log('Feedback updated:', id);
  } catch (err) {
    console.error('Error updating feedback:', err);
    res.status(500).json({ 
      message: 'Failed to update feedback',
      error: err.message 
    });
  }
});

/**
 * DELETE /api/feedback/:id
 * Delete a feedback entry (admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid feedback ID' });
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
    console.log('Feedback deleted:', id);
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).json({ 
      message: 'Failed to delete feedback',
      error: err.message 
    });
  }
});

module.exports = router;