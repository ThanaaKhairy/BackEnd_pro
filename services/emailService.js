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
    from: `"LandChoice" <${process.env.EMAIL_ADDRESS}>`,
    to: email,
    subject: 'OTP Verification',
    html: `
      <div style="margin:0; padding:0; background:#f6f7fb; font-family:Arial, sans-serif;">
        
        <div style="max-width:450px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="padding:20px; text-align:center; border-bottom:1px solid #eee;">
            <h2 style="margin:0; font-size:18px; color:#222;">LandChoice</h2>
            <p style="margin:5px 0 0; font-size:12px; color:#777;">Email Verification</p>
          </div>

          <!-- Body -->
          <div style="padding:30px; text-align:center;">
            
            <p style="font-size:14px; color:#333;">
              Hello <strong>${email.split('@')[0]}</strong>,
            </p>

            <p style="font-size:13px; color:#555; line-height:1.6;">
              Use the code below to verify your email address.
            </p>

            <div style="margin:25px 0;">
              <div style="
                display:inline-block;
                padding:14px 22px;
                font-size:24px;
                letter-spacing:5px;
                font-weight:bold;
                color:#111;
                background:#f1f3f6;
                border-radius:8px;
              ">
                ${verificationCode}
              </div>
            </div>

            <p style="font-size:12px; color:#888;">
              This code will expire in <strong>3 minutes</strong>.
            </p>

            <p style="font-size:11px; color:#999; margin-top:20px;">
              If you didn’t request this, you can ignore this email.
            </p>

          </div>

          <!-- Footer -->
          <div style="padding:12px; text-align:center; font-size:11px; color:#aaa; border-top:1px solid #eee;">
            © ${new Date().getFullYear()} LandChoice
          </div>

        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
module.exports = { sendVerificationEmail };