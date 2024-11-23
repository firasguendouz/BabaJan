const nodemailer = require('nodemailer');

const emailService = {};

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP configuration
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send email
emailService.sendEmail = async (to, subject, text, html = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Email Error: ${error.message}`);
  }
};

// Send password reset email
emailService.sendPasswordReset = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const text = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
  const html = `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`;
  
  await emailService.sendEmail(email, subject, text, html);
};

module.exports = emailService;
