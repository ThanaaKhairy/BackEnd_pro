const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'OTP Verification',
    text: `  Hello,

        Your verification code is: ${verificationCode}

        Please enter this code to complete your request.  

        This code is valid for 3 minutes.

        Thank you,  
        Land Choice Team`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };