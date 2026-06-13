// controllers/advertisementRequestController.js
const nodemailer = require('nodemailer');
const connectDB = require('../config/database');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Format email HTML
const formatAdRequestEmail = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; }
        h2 { color: #6C8FD9; border-bottom: 2px solid #6C8FD9; padding-bottom: 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #6C8FD9; margin-bottom: 5px; }
        .value { background: #f3f4f6; padding: 10px; border-radius: 5px; margin-top: 5px; }
        .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Advertisement Request</h2>
        
        <div class="field">
          <div class="label">Name:</div>
          <div class="value">${data.name}</div>
        </div>
        
        <div class="field">
          <div class="label">Email:</div>
          <div class="value">${data.email}</div>
        </div>
        
        <div class="field">
          <div class="label">Company Name:</div>
          <div class="value">${data.companyName || 'Not provided'}</div>
        </div>
        
        <div class="field">
          <div class="label">Category:</div>
          <div class="value">${data.category}</div>
        </div>
        
        <div class="field">
          <div class="label">Message & Requirements:</div>
          <div class="value">${data.message.replace(/\n/g, '<br>')}</div>
        </div>
        
        <div class="footer">
          <p>This request was submitted through the Land Choice website.</p>
          <p>Sent on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Submit advertisement request
const submitAdRequest = async (req, res) => {
  try {
    await connectDB();
    
    const { name, email, companyName, category, message } = req.body;
    
    // Validation
    if (!name || !email || !category || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill all required fields: name, email, category, message',
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
    }
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: 'thanaamater@gmail.com',
      subject: `New Ad Request from ${name} - ${category}`,
      replyTo: email,
      html: formatAdRequestEmail({ name, email, companyName, category, message }),
      text: `
        New Advertisement Request
        
        Name: ${name}
        Email: ${email}
        Company: ${companyName || 'Not provided'}
        Category: ${category}
        
        Message:
        ${message}
        
        Sent on: ${new Date().toLocaleString()}
      `,
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Your request has been sent successfully! Our team will review it and get back to you shortly.',
    });
  } catch (error) {
    console.error('Ad Request Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send your request. Please try again later.',
    });
  }
};

module.exports = { submitAdRequest };