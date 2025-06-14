const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Define Contact schema
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'spam', 'archived'],
    default: 'new'
  },
  notes: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

// Submit a new contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Name, email, and message are required fields'
      });
    }
    
    // Create new contact entry
    const newContact = new Contact({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
    
    await newContact.save();
    
    // Send notification email to admin
    try {
      await sendNotificationEmail(newContact);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Continue with the process even if email fails
    }
    
    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon.',
      success: true
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      message: 'Server error while submitting your message. Please try again later.',
      error: error.message
    });
  }
};

// Get all contact submissions (admin only)
exports.getAllContacts = async (req, res) => {
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
    const contacts = await Contact.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();
    
    // Get total count for pagination
    const total = await Contact.countDocuments(query);
    
    res.status(200).json({
      message: 'Contact submissions retrieved successfully',
      data: contacts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error retrieving contact submissions:', error);
    res.status(500).json({
      message: 'Server error while retrieving contact submissions',
      error: error.message
    });
  }
};

// Get contact by ID (admin only)
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    
    // If status is 'new', update it to 'read'
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }
    
    res.status(200).json({
      message: 'Contact submission retrieved successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error retrieving contact submission:', error);
    res.status(500).json({
      message: 'Server error while retrieving contact submission',
      error: error.message
    });
  }
};

// Update contact status and notes (admin only)
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    
    // Update fields if provided
    if (status) contact.status = status;
    if (notes !== undefined) contact.notes = notes;
    
    await contact.save();
    
    res.status(200).json({
      message: 'Contact submission updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({
      message: 'Server error while updating contact submission',
      error: error.message
    });
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    
    await Contact.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Contact submission deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    res.status(500).json({
      message: 'Server error while deleting contact submission',
      error: error.message
    });
  }
};

// Reply to contact (admin only)
exports.replyToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage, subject } = req.body;
    
    // Validate required fields
    if (!replyMessage) {
      return res.status(400).json({ message: 'Reply message is required' });
    }
    
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    
    // Send reply email
    try {
      await sendReplyEmail(contact, replyMessage, subject);
      
      // Update contact status to 'replied'
      contact.status = 'replied';
      contact.notes = contact.notes 
        ? `${contact.notes}\n\n[${new Date().toISOString()}] Replied: ${replyMessage.substring(0, 100)}...` 
        : `[${new Date().toISOString()}] Replied: ${replyMessage.substring(0, 100)}...`;
      
      await contact.save();
      
      res.status(200).json({
        message: 'Reply sent successfully',
        data: contact
      });
    } catch (emailError) {
      console.error('Failed to send reply email:', emailError);
      res.status(500).json({
        message: 'Failed to send reply email',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Error replying to contact:', error);
    res.status(500).json({
      message: 'Server error while replying to contact',
      error: error.message
    });
  }
};

// Helper function to send notification email to admin
async function sendNotificationEmail(contact) {
  // Get email configuration from environment variables
  const { 
    SMTP_HOST, 
    SMTP_PORT, 
    SMTP_USER, 
    SMTP_PASS, 
    ADMIN_EMAIL,
    SITE_NAME = 'Dumpsexpert'
  } = process.env;
  
  // Check if email configuration exists
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
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
  
  // Email content
  const mailOptions = {
    from: `"${SITE_NAME}" <${SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${contact.message.replace(/\n/g, '<br>')}
      </div>
      <p><strong>Submitted:</strong> ${contact.createdAt}</p>
      <p><strong>IP Address:</strong> ${contact.ipAddress}</p>
      <hr>
      <p>You can manage this submission in your admin dashboard.</p>
    `
  };
  
  // Send email
  return transporter.sendMail(mailOptions);
}

// Helper function to send reply email to contact
async function sendReplyEmail(contact, replyMessage, customSubject) {
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
  
  // Email subject
  const subject = customSubject || `Re: ${contact.subject}`;
  
  // Email content
  const mailOptions = {
    from: `"${SITE_NAME}" <${SMTP_USER}>`,
    to: contact.email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${contact.name},</h2>
        <div style="margin-bottom: 20px;">
          ${replyMessage.replace(/\n/g, '<br>')}
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666;">
          <p>This is in response to your inquiry:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="margin-left: 15px; padding-left: 15px; border-left: 3px solid #ddd;">
              ${contact.message.replace(/\n/g, '<br>')}
            </div>
            <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8em; color: #999; text-align: center;">
          <p>© ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    `
  };
  
  // Send email
  return transporter.sendMail(mailOptions);
}