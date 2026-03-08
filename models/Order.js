// =====================================================
// ORDER MODEL - MongoDB Schema
// =====================================================

const mongoose = require('mongoose');

// Order Schema Definition
const orderSchema = new mongoose.Schema({
  // Reference to User who placed the order
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Ordered items array
  items: [{
    // Reference to MenuItem
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },

    // Item name at time of order (in case menu changes)
    name: {
      type: String,
      required: true
    },

    // Item price at time of order
    price: {
      type: Number,
      required: true
    },

    // Quantity ordered
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },

    // Item image at time of order
    image: {
      type: String,
      default: ''
    }
  }],

  // Total order amount
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },

  // Delivery charges
  deliveryCharge: {
    type: Number,
    default: 0
  },

  // Customer name (for guest orders or copied from user)
  customerName: {
    type: String,
    required: [true, 'Please provide customer name'],
    trim: true
  },

  // Customer phone number
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },

  // Delivery address
  deliveryAddress: {
    type: String,
    required: [true, 'Please provide delivery address']
  },

  // Payment method: 'online' or 'cod' (cash on delivery)
  paymentMethod: {
    type: String,
    enum: ['online', 'cod'],
    default: 'cod'
  },

  // Payment status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  // Razorpay payment ID (for online payments)
  paymentId: {
    type: String,
    default: ''
  },

  // Order status lifecycle
  status: {
    type: String,
    enum: ['received', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'received'
  },

  // Optional notes from customer
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },

  // Estimated delivery time
  estimatedTime: {
    type: Number, // in minutes
    default: 30
  },

  // Order timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Order completion timestamp
  deliveredAt: {
    type: Date
  }
});

// =====================================================
// INDEX: For faster queries
// =====================================================
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// =====================================================
// VIRTUAL: Calculate total items in order
// =====================================================
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

// =====================================================
// PRE-SAVE: Set deliveredAt when status is delivered
// =====================================================
orderSchema.pre('save', function(next) {
  if (this.status === 'delivered' && !this.deliveredAt) {
    this.deliveredAt = Date.now();
  }
  next();
});

// Export Order model
module.exports = mongoose.model('Order', orderSchema);

