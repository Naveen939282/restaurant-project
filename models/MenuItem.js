// =====================================================
// MENU ITEM MODEL - MongoDB Schema
// =====================================================

const mongoose = require('mongoose');

// MenuItem Schema Definition
const menuItemSchema = new mongoose.Schema({
  // Dish name
  name: {
    type: String,
    required: [true, 'Please provide dish name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  // Dish description
  description: {
    type: String,
    required: [true, 'Please provide dish description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Dish price in INR
  price: {
    type: Number,
    required: [true, 'Please provide dish price'],
    min: [0, 'Price cannot be negative']
  },

  // Category: Andhra Meals, Biryani, Tiffins, Starters, Beverages
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['Andhra Meals', 'Biryani', 'Tiffins', 'Starters', 'Beverages', 'Desserts', 'Curries']
  },

  // Image URL
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  },

  // Whether the item is currently available for ordering
  isAvailable: {
    type: Boolean,
    default: true
  },

  // Whether to show this item in featured/popular section
  isFeatured: {
    type: Boolean,
    default: false
  },

  // Spice level: 1-5
  spiceLevel: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },

  // Preparation time in minutes
  prepTime: {
    type: Number,
    min: 5,
    default: 20
  },

  // Tags for search (vegetarian, non-veg, etc.)
  tags: [{
    type: String,
    trim: true
  }],

  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Last update timestamp
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// =====================================================
// INDEX: For faster searching
// =====================================================
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });

// =====================================================
// PRE-SAVE: Update timestamp
// =====================================================
menuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Export MenuItem model
module.exports = mongoose.model('MenuItem', menuItemSchema);

