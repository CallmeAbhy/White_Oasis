const nodemailer = require("nodemailer");
const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is : ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendOtp;
