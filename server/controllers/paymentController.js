const Payment = require('../models/paymentSchema');
const User = require('../models/userSchema');
const Order = require('../models/orderSchema'); // Add this line
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// RAZORPAY CREATE ORDER
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: currency || "INR",
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

// RAZORPAY VERIFY PAYMENT
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, orderId } = req.body;
    console.log("Verifying payment:", { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount });

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      console.log("Signature verified successfully");
      
      // Create payment record
      const payment = await Payment.create({
        userId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amount,
        status: 'completed'
      });

      // Update order status using the orderId from the request
      const order = await Order.findByIdAndUpdate(
        orderId,
        { 
          status: 'completed',
          paymentStatus: 'completed',
          paymentId: payment._id
        },
        { new: true }
      );

      if (!order) {
        console.error('Order not found:', orderId);
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update user if userId exists
      if (order.user) {
        const user = await User.findByIdAndUpdate(
          order.user,
          {
            subscription: 'yes',
            role: 'student'
          },
          { new: true }
        );
        
        const token = user.generateJWT();
        return res.json({ success: true, token });
      }

      res.json({ success: true });
    } else {
      console.log("Signature verification failed");
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error.stack);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// PAYPAL PAYMENT SUCCESS (Frontend should call this after PayPal approval)
exports.processPayPalPayment = async (req, res) => {
  try {
    const { orderID, amount } = req.body;

    await User.findByIdAndUpdate(req.user._id, {
      subscription: 'yes',
      role: 'student'
    });

    const payment = await Payment.create({
      userId,
      paymentId: paypalPaymentId,
      orderId: orderId,
      amount: amount,
      status: 'completed'
    });

    // Update order status
    await Order.findOneAndUpdate(
        { paymentId: payment._id },
        { 
            status: 'completed',
            paymentStatus: 'completed'
        }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('PayPal payment processing failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
};