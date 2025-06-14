const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Define Subscriber schema
const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'unsubscribed'],
    default: 'pending'
  },
  confirmationToken: {
    type: String
  },
  unsubscribeToken: {
    type: String
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  unsubscribedAt: {
    type: Date
  },
  lastEmailSentAt: {
    type: Date
  }
}, { timestamps: true });

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

// Define Newsletter schema for tracking sent newsletters
const NewsletterSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  recipientCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'sending', 'sent', 'failed'],
    default: 'draft'
  }
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    
    if (existingSubscriber) {
      // If already active, return success
      if (existingSubscriber.status === 'active') {
        return res.status(200).json({ 
          message: 'You are already subscribed to our newsletter',
          alreadySubscribed: true
        });
      }
      
      // If pending, resend confirmation email
      if (existingSubscriber.status === 'pending') {
        // Generate new confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        existingSubscriber.confirmationToken = confirmationToken;
        
        await existingSubscriber.save();
        
        // Send confirmation email
        try {
          await sendConfirmationEmail(existingSubscriber);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
        
        return res.status(200).json({ 
          message: 'Please check your email to confirm your subscription',
          confirmationRequired: true
        });
      }
      
      // If unsubscribed, reactivate
      if (existingSubscriber.status === 'unsubscribed') {
        // Generate new confirmation token
        const confirmationToken = crypto.randomBytes(32).toString('hex');
        existingSubscriber.confirmationToken = confirmationToken;
        existingSubscriber.status = 'pending';
        
        await existingSubscriber.save();
        
        // Send confirmation email
        try {
          await sendConfirmationEmail(existingSubscriber);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
        
        return res.status(200).json({ 
          message: 'Please check your email to confirm your subscription',
          confirmationRequired: true
        });
      }
    }
    
    // Create new subscriber
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    
    const newSubscriber = new Subscriber({
      email,
      name: name || '',
      confirmationToken,
      unsubscribeToken,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await newSubscriber.save();
    
    // Send confirmation email
    try {
      await sendConfirmationEmail(newSubscriber);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue with the process even if email fails
    }
    
    res.status(201).json({
      message: 'Please check your email to confirm your subscription',
      confirmationRequired: true
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      message: 'Server error while processing your subscription',
      error: error.message
    });
  }
};

// Confirm subscription
exports.confirmSubscription = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find subscriber with this token
    const subscriber = await Subscriber.findOne({ confirmationToken: token });
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Invalid or expired confirmation link' });
    }
    
    // Update subscriber status
    subscriber.status = 'active';
    subscriber.confirmedAt = new Date();
    subscriber.confirmationToken = undefined; // Clear token after use
    
    await subscriber.save();
    
    // Redirect to confirmation success page
    res.redirect(process.env.FRONTEND_URL + '/subscription-confirmed');
  } catch (error) {
    console.error('Error confirming subscription:', error);
    res.status(500).json({
      message: 'Server error while confirming your subscription',
      error: error.message
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Find subscriber with this token
    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Invalid or expired unsubscribe link' });
    }
    
    // Update subscriber status
    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    
    await subscriber.save();
    
    // Redirect to unsubscribe success page
    res.redirect(process.env.FRONTEND_URL + '/unsubscribed');
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      message: 'Server error while processing your unsubscribe request',
      error: error.message
    });
  }
};

// Get all subscribers (admin only)
exports.getAllSubscribers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const subscribers = await Subscriber.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Subscriber.countDocuments(query);
    
    res.status(200).json({
      message: 'Subscribers retrieved successfully',
      data: subscribers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving subscribers:', error);
    res.status(500).json({
      message: 'Server error while retrieving subscribers',
      error: error.message
    });
  }
};

// Delete subscriber (admin only)
exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    await Subscriber.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Subscriber deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({
      message: 'Server error while deleting subscriber',
      error: error.message
    });
  }
};

// Update subscriber status (admin only)
exports.updateSubscriberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !['pending', 'active', 'unsubscribed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    // Update status and relevant timestamp
    subscriber.status = status;
    
    if (status === 'active' && !subscriber.confirmedAt) {
      subscriber.confirmedAt = new Date();
    } else if (status === 'unsubscribed' && !subscriber.unsubscribedAt) {
      subscriber.unsubscribedAt = new Date();
    }
    
    await subscriber.save();
    
    res.status(200).json({
      message: 'Subscriber status updated successfully',
      data: subscriber
    });
  } catch (error) {
    console.error('Error updating subscriber status:', error);
    res.status(500).json({
      message: 'Server error while updating subscriber status',
      error: error.message
    });
  }
};

// Create and send newsletter (admin only)
exports.createAndSendNewsletter = async (req, res) => {
  try {
    const { subject, content, testEmail } = req.body;
    const userId = req.user?._id;
    
    // Validate required fields
    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }
    
    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Create newsletter record
    const newsletter = new Newsletter({
      subject,
      content,
      sentBy: userId,
      status: 'draft'
    });
    
    await newsletter.save();
    
    // If testEmail is provided, send a test email
    if (testEmail) {
      try {
        await sendTestNewsletter(testEmail, subject, content);
        
        return res.status(200).json({
          message: 'Test newsletter sent successfully',
          data: newsletter,
          testSent: true
        });
      } catch (emailError) {
        console.error('Failed to send test newsletter:', emailError);
        return res.status(500).json({
          message: 'Failed to send test newsletter',
          error: emailError.message,
          newsletterId: newsletter._id
        });
      }
    }
    
    // Send to all active subscribers
    try {
      // Update status to sending
      newsletter.status = 'sending';
      await newsletter.save();
      
      // Get all active subscribers
      const activeSubscribers = await Subscriber.find({ status: 'active' });
      
      if (activeSubscribers.length === 0) {
        newsletter.status = 'sent';
        newsletter.recipientCount = 0;
        await newsletter.save();
        
        return res.status(200).json({
          message: 'No active subscribers found',
          data: newsletter
        });
      }
      
      // Send newsletter to all subscribers (in batches to avoid timeout)
      // This should ideally be handled by a background job/queue
      // For simplicity, we're doing it synchronously here
      let sentCount = 0;
      
      for (const subscriber of activeSubscribers) {
        try {
          await sendNewsletterToSubscriber(subscriber, subject, content);
          
          // Update subscriber's lastEmailSentAt
          subscriber.lastEmailSentAt = new Date();
          await subscriber.save();
          
          sentCount++;
        } catch (individualError) {
          console.error(`Failed to send newsletter to ${subscriber.email}:`, individualError);
          // Continue with next subscriber
        }
      }
      
      // Update newsletter status
      newsletter.status = 'sent';
      newsletter.recipientCount = sentCount;
      newsletter.sentAt = new Date();
      await newsletter.save();
      
      res.status(200).json({
        message: `Newsletter sent successfully to ${sentCount} subscribers`,
        data: newsletter
      });
    } catch (sendError) {
      console.error('Error sending newsletter:', sendError);
      
      // Update newsletter status to failed
      newsletter.status = 'failed';
      await newsletter.save();
      
      res.status(500).json({
        message: 'Failed to send newsletter',
        error: sendError.message,
        newsletterId: newsletter._id
      });
    }
  } catch (error) {
    console.error('Error creating newsletter:', error);
    res.status(500).json({
      message: 'Server error while creating newsletter',
      error: error.message
    });
  }
};

// Get all newsletters (admin only)
exports.getAllNewsletters = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const newsletters = await Newsletter.find(query)
      .populate('sentBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Newsletter.countDocuments(query);
    
    res.status(200).json({
      message: 'Newsletters retrieved successfully',
      data: newsletters,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving newsletters:', error);
    res.status(500).json({
      message: 'Server error while retrieving newsletters',
      error: error.message
    });
  }
};

// Get newsletter by ID (admin only)
exports.getNewsletterById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const newsletter = await Newsletter.findById(id)
      .populate('sentBy', 'name email');
    
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    
    res.status(200).json({
      message: 'Newsletter retrieved successfully',
      data: newsletter
    });
  } catch (error) {
    console.error('Error retrieving newsletter:', error);
    res.status(500).json({
      message: 'Server error while retrieving newsletter',
      error: error.message
    });
  }
};

// Delete newsletter (admin only)
exports.deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    
    const newsletter = await Newsletter.findById(id);
    
    if (!newsletter) {
      return res.status(404).json({ message: 'Newsletter not found' });
    }
    
    await Newsletter.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Newsletter deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({
      message: 'Server error while deleting newsletter',
      error: error.message
    });
  }
};

// Helper function to send confirmation email
async function sendConfirmationEmail(subscriber) {
  // Get email configuration from environment variables
  const { 
    SMTP_HOST, 
    SMTP_PORT, 
    SMTP_USER, 
    SMTP_PASS,
    FRONTEND_URL,
    SITE_NAME = 'Dumpsexpert'
  } = process.env;
  
  // Check if email configuration exists
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FRONTEND_URL) {
    throw new Error('Email configuration is missing');
  }
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
  
  const confirmationUrl = `${FRONTEND_URL}/api/newsletter/confirm/${subscriber.confirmationToken}`;
  
  // Email content
  const mailOptions = {
    from: `"${SITE_NAME}" <${SMTP_USER}>`,
    to: subscriber.email,
    subject: `Confirm Your Newsletter Subscription - ${SITE_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm Your Subscription</h2>
        <p>Hello${subscriber.name ? ' ' + subscriber.name : ''},</p>
        <p>Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirm Subscription</a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p><a href="${confirmationUrl}">${confirmationUrl}</a></p>
        
        <p>If you didn't request this subscription, you can safely ignore this email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #999; text-align: center;">
          <p>© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    `
  };
  
  // Send email
  return transporter.sendMail(mailOptions);
}

// Helper function to send newsletter to subscriber
async function sendNewsletterToSubscriber(subscriber, subject, content) {
  // Get email configuration from environment variables
  const { 
    SMTP_HOST, 
    SMTP_PORT, 
    SMTP_USER, 
    SMTP_PASS,
    FRONTEND_URL,
    SITE_NAME = 'Dumpsexpert'
  } = process.env;
  
  // Check if email configuration exists
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FRONTEND_URL) {
    throw new Error('Email configuration is missing');
  }
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
  
  const unsubscribeUrl = `${FRONTEND_URL}/api/newsletter/unsubscribe/${subscriber.unsubscribeToken}`;
  
  // Add unsubscribe link to the content
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${content}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #999;">
        <p>You're receiving this email because you subscribed to our newsletter.</p>
        <p>To unsubscribe, <a href="${unsubscribeUrl}">click here</a>.</p>
      </div>
      
      <div style="margin-top: 20px; font-size: 0.8em; color: #999; text-align: center;">
        <p>© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
      </div>
    </div>
  `;
  
  // Email content
  const mailOptions = {
    from: `"${SITE_NAME}" <${SMTP_USER}>`,
    to: subscriber.email,
    subject: subject,
    html: emailContent
  };
  
  // Send email
  return transporter.sendMail(mailOptions);
}

// Helper function to send test newsletter
async function sendTestNewsletter(testEmail, subject, content) {
  // Get email configuration from environment variables
  const { 
    SMTP_HOST, 
    SMTP_PORT, 
    SMTP_USER, 
    SMTP_PASS,
    SITE_NAME = 'Dumpsexpert'
  } = process.env;
  
  // Check if email configuration exists
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Email configuration is missing');
  }
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === '465',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
  
  // Add test notice to the content
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ffffcc; padding: 10px; margin-bottom: 20px; border: 1px solid #ffcc00; border-radius: 4px;">
        <p><strong>TEST EMAIL</strong> - This is a test newsletter. No actual subscribers have received this.</p>
      </div>
      
      ${content}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #999; text-align: center;">
        <p>© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
      </div>
    </div>
  `;
  
  // Email content
  const mailOptions = {
    from: `"${SITE_NAME} (TEST)" <${SMTP_USER}>`,
    to: testEmail,
    subject: `[TEST] ${subject}`,
    html: emailContent
  };
  
  // Send email
  return transporter.sendMail(mailOptions);
}