// src/components/ResetPassword.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useError } from "../context/ErrorContext";
import { useApiErrorHandler } from "../utils/apiErrorHandler";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { showError } = useError();
  const { handleApiError } = useApiErrorHandler();

  const requestOtp = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/password-reset/request-reset`,
        { email }
      );
      alert("OTP sent to your email.");
      setStep(2);
    } catch (error) {
      handleApiError(error);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      showError("Please enter the OTP sent to your email");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/password-reset/verify-otp`,
        { email, otp }
      );
      alert(response.data.message);
    } catch (error) {
      handleApiError(error);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/password-reset/reset-password`,
        { email, newPassword }
      );
      alert("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://storage.googleapis.com/a1aa/image/6b1a82a1-b6b6-4003-ae6f-815a0e875b31.jpeg')",
      }}
    >
      <div className="max-w-lg mx-4 p-6 bg-white shadow-lg rounded-lg">
        <ol className="flex items-center w-full text-sm text-gray-500 font-medium mb-8">
          {["Request OTP", "Verify OTP", "Reset Password"].map(
            (label, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  step > index ? "text-indigo-600" : "text-gray-600"
                }`}
              >
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                    step > index ? "bg-indigo-600 text-white" : "bg-gray-100"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="mx-4">{label}</span>
                {index < 2 && (
                  <div
                    className={`flex-grow border-b ${
                      step > index ? "border-indigo-600" : "border-gray-200"
                    }`}
                  ></div>
                )}
              </li>
            )
          )}
        </ol>
        <div className="space-y-6">
          {step === 1 && (
            <form onSubmit={requestOtp} className="space-y-4">
              <h2 className="text-2xl font-bold text-center">
                Request Password Reset
              </h2>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Send OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyOtp} className="space-y-6">
              <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index] || ""}
                    onChange={(e) => {
                      const newOtp = otp.padEnd(6, " ").split("");
                      newOtp[index] = e.target.value;
                      setOtp(newOtp.join("").trim());
                      // Auto-focus next input
                      if (e.target.value && index < 5) {
                        document.getElementById(`otp-${index + 1}`).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        document.getElementById(`otp-${index - 1}`).focus();
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-12 h-14 text-center text-lg font-medium border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm"
                    required
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Verify OTP
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={resetPassword} className="space-y-4">
              <h2 className="text-2xl font-bold text-center">Reset Password</h2>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2"
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-gray-500"
                  />
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
