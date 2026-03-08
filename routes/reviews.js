// =====================================================
// REVIEW ROUTES - Customer Reviews
// =====================================================

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

// @route   GET /api/reviews
// @desc    Get all approved reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);

    // Calculate average rating
    const avgResult = await Review.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
    ]);

    const averageRating = avgResult[0]?.avgRating?.toFixed(1) || 0;
    const totalReviews = avgResult[0]?.total || 0;

    res.json({
      success: true,
      reviews,
      averageRating: parseFloat(averageRating),
      totalReviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/stats
// @desc    Get review statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const avgResult = await Review.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats,
      averageRating: avgResult[0]?.avgRating?.toFixed(1) || 0,
      totalReviews: avgResult[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review stats',
      error: error.message
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Public (or Private if logged in)
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    // If user is logged in, associate with user
    let userId = null;
    let userName = name;
    
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken');
        const User = require('../models/User');
        
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        
        const user = await User.findById(decoded.id);
        if (user) {
          userName = user.name;
        }
      } catch (err) {
        // Continue without user association
      }
    }

    const review = await Review.create({
      user: userId,
      name: userName,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be visible after approval.',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/all
// @desc    Get all reviews (including unapproved - admin only)
// @access  Private (Admin)
router.get('/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const reviews = await Review.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all reviews',
      error: error.message
    });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve/reject a review (admin only)
// @access  Private (Admin)
router.put('/:id/approve', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: isApproved ? 'Review approved' : 'Review rejected',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review (admin only)
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
});

module.exports = router;

