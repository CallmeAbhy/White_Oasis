const express = require("express");
const {
  requestPasswordReset,
  verifyOtp,
  resetPassword,
} = require("../controllers/passwordResetController");
const router = express.Router();

router.post("/request-reset", requestPasswordReset);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
