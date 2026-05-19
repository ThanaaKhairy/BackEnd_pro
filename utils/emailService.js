// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_ADDRESS,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// const sendVerificationEmail = async (email, verificationCode) => {
//   const mailOptions = {
//     from: process.env.EMAIL_ADDRESS,
//     to: email,
//     subject: 'OTP Verification',
//     text: `  Hello,

//         Your verification code is: ${verificationCode}

//         Please enter this code to complete your request.  

//         This code is valid for 3 minutes.

//         Thank you,  
//         Land Choice Team`
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = { sendVerificationEmail };

const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationCode) => {
  // ✅ للـ Debugging - عشان تشوفي هل المتغيرات موجودة ولا لأ
  console.log('EMAIL_ADDRESS from env:', process.env.
    EMAIL_ADDRESS ? '✅ Found' : '❌ MISSING');
  console.log('EMAIL_PASSWORD from env:', process.env.EMAIL_PASSWORD ? '✅ Found' : '❌ MISSING');
  
  // ✅ لو المتغيرات مش موجودة، ارمي error واضح
  if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials missing in environment variables');
    throw new Error('Email configuration missing');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: 'OTP Verification',
    text: `Hello,\n\nYour verification code is: ${verificationCode}\n\nThis code is valid for 3 minutes.\n\nThank you,\nLand Choice Team`
  };

  await transporter.sendMail(mailOptions);
  console.log('✅ Email sent successfully to:', email);
};

module.exports = { sendVerificationEmail };