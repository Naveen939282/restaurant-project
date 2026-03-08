// =====================================================
// PAYMENT ROUTES - Razorpay Integration
// =====================================================

const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order for payment
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId || `order_${Date.now()}`,
      payment_capture: 1 // Auto-capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified, update order status
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: 'paid',
          paymentId: razorpay_payment_id,
          status: 'received'
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    } else {
      // Signature verification failed
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed'
      });

      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
});

// @route   POST /api/payment/webhook
// @desc    Handle Razorpay webhooks
// @access  Public (verified by Razorpay)
router.post('/webhook', async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature (in production)
    if (webhookSecret && signature) {
      const expectedSign = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSign) {
        return res.status(400).json({
          success: false,
          message: 'Invalid webhook signature'
        });
      }
    }

    const event = req.body;
    const paymentId = event.payload.payment.entity.id;

    switch (event.event) {
      case 'payment.captured':
        // Find order by payment_id and update
        const order = await Order.findOne({ paymentId });
        if (order) {
          order.paymentStatus = 'paid';
          await order.save();
        }
        break;

      case 'payment.failed':
        const failedOrder = await Order.findOne({ paymentId });
        if (failedOrder) {
          failedOrder.paymentStatus = 'failed';
          await failedOrder.save();
        }
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({
      success: true,
      message: 'Webhook processed'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error'
    });
  }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay key for frontend
// @access  Public
router.get('/key', (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID || 'your_key_id'
  });
});

module.exports = router;

