const Payment = require('../models/paymentSchema');
const User = require('../models/userSchema');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit
      currency,
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update user subscription status
      await User.findByIdAndUpdate(req.user._id, { subscription: 'yes' });

      // Create payment record
      await Payment.create({
        user: req.user._id,
        amount: req.body.amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentId: razorpay_payment_id,
        status: 'completed'
      });

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

exports.createStripeSession = async (req, res) => {
  try {
    const { amount, currency, items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency,
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/student/dashboard`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Update user subscription status
      await User.findByIdAndUpdate(session.client_reference_id, { subscription: 'yes' });

      // Create payment record
      await Payment.create({
        user: session.client_reference_id,
        amount: session.amount_total / 100,
        currency: session.currency.toUpperCase(),
        paymentMethod: 'stripe',
        paymentId: session.payment_intent,
        status: 'completed'
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
};