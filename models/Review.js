// =====================================================
// REVIEW MODEL - MongoDB Schema
// =====================================================

const mongoose = require('mongoose');

// Review Schema Definition
const reviewSchema = new mongoose.Schema({
  // Reference to User who wrote the review (optional for guest reviews)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Reviewer's name (required)
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },

  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },

  // Review comment
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },

  // Whether the review is approved/visible
  isApproved: {
    type: Boolean,
    default: true
  },

  // Review creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// =====================================================
// INDEX: For faster queries
// =====================================================
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// =====================================================
// STATIC: Calculate average rating
// =====================================================
reviewSchema.statics.calcAverageRating = async function() {
  const stats = await this.aggregate([
    {
      $match: { isApproved: true }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return stats[0] || { averageRating: 0, totalReviews: 0 };
};

// =====================================================
// POST-SAVE: Update average rating after review is saved
// =====================================================
reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRating();
});

// Export Review model
module.exports = mongoose.model('Review', reviewSchema);

