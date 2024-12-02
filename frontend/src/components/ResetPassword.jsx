// src/components/ResetPassword.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password
  const navigate = useNavigate();

  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:7001/api/password-reset/request-reset",
        { email }
      );
      alert("OTP sent to your email.");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      alert("Error: " + error.response.data.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:7001/api/password-reset/verify-otp",
        { email, otp }
      );
      alert(response.data.message);
      setStep(3); // Move to password reset step
    } catch (error) {
      alert("Error: " + error.response.data.message);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:7001/api/password-reset/reset-password",
        { email, newPassword }
      );
      alert("Password reset successfully!");
      // Optionally redirect to login page
      setTimeout(() => {
        navigate("/login"); // Navigate to the login route
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      alert("Error: " + error.response.data.message);
    }
  };
  // https://www.blackbox.ai/chat/NMjGoc3
  // https://www.blackbox.ai/chat/KUZSYec
  // https://www.blackbox.ai/chat/csemjwq
  return (
    <div>
      {step === 1 && (
        <form onSubmit={requestOtp}>
          <h2>Request Password Reset</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp}>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword}>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
