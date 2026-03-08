// =====================================================
// MENU ROUTES - Menu Item Management
// =====================================================

const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/menu
// @desc    Get all menu items (public - for customers)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, available } = req.query;
    
    // Build query
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (available === 'true') {
      query.isAvailable = true;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get menu items
    const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: menuItems.length,
      menuItems
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message
    });
  }
});

// @route   GET /api/menu/categories
// @desc    Get all unique categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    
    res.json({
      success: true,
      categories: ['All', ...categories]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// @route   GET /api/menu/featured
// @desc    Get featured menu items
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({ 
      isFeatured: true, 
      isAvailable: true 
    }).limit(8);
    
    res.json({
      success: true,
      count: featuredItems.length,
      menuItems: featuredItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured items',
      error: error.message
    });
  }
});

// @route   GET /api/menu/popular
// @desc    Get popular menu items (by order count - would need aggregation)
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    // For now, return items marked as featured as popular
    const popularItems = await MenuItem.find({ 
      isAvailable: true 
    }).limit(10);
    
    res.json({
      success: true,
      count: popularItems.length,
      menuItems: popularItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular items',
      error: error.message
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu item',
      error: error.message
    });
  }
});

// @route   POST /api/menu
// @desc    Create new menu item
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    
    res.status(201).json({
      success: true,
      menuItem
    });
  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating menu item',
      error: error.message
    });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating menu item',
      error: error.message
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting menu item',
      error: error.message
    });
  }
});

// @route   POST /api/menu/bulk
// @desc    Create multiple menu items (for seeding)
// @access  Private (Admin only)
router.post('/bulk', protect, authorize('admin'), async (req, res) => {
  try {
    const menuItems = await MenuItem.insertMany(req.body);
    
    res.status(201).json({
      success: true,
      count: menuItems.length,
      menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating menu items',
      error: error.message
    });
  }
});

module.exports = router;

