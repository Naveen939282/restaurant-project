// =====================================================
// GONGURA HOTEL - Restaurant Management System
// Backend Server
// =====================================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payment');

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =====================================================
// API ROUTES
// =====================================================

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gongura Hotel API is running' });
});

// =====================================================
// STATIC FILES FOR PRODUCTION
// =====================================================

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// =====================================================
// ERROR HANDLING MIDDLEWARE
// =====================================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =====================================================
// DATABASE CONNECTION & SERVER START
// =====================================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gongura_hotel';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB error:', err);
    process.exit(1);
  });

module.exports = app;

