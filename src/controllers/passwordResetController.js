const User = require("../models/userModel");
const sendOtp = require("../utils/sendOtp");
const bcrypt = require("bcryptjs");

let otpStore = {};
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  let user = await Admin.findOne({ username });
  if (!user) {
    user = await Manager.findOne({ username });
  }
  if (!user) {
    user = await User.findOne({ username });
  }
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const otp = Math.floor(100000 + Math.random() * 90000).toString();
  otpStore[email] = otp;
  await sendOtp(email, otp);
  res.status(200).json({ message: "OTP send to your email" });
};
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];
    res
      .status(200)
      .json({ message: "OTP verified, you can now reset your password" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.status(200).json({ message: "Password reset successfully " });
};
module.exports = {
  requestPasswordReset,
  verifyOtp,
  resetPassword,
};
