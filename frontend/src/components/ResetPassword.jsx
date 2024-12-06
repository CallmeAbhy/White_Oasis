// src/components/ResetPassword.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Import the eye and eye-slash icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="max-w-4xl mx-auto p-4">
      <ol className="flex items-center w-full text-sm text-gray-500 font-medium sm:text-base mb-8">
        <li
          className={`flex md:w-full items-center ${
            step >= 1 ? "text-indigo-600" : "text-gray-600"
          } 

  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 

  after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}
        >
          <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
            <span
              className={`w-6 h-6 ${
                step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-100"
              } 

      border border-gray-200 rounded-full flex justify-center items-center mr-3 

      text-sm lg:w-10 lg:h-10`}
            >
              1
            </span>
            Request OTP
          </div>
        </li>

        <li
          className={`flex md:w-full items-center ${
            step >= 2 ? "text-indigo-600" : "text-gray-600"
          } 

  sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 

  after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}
        >
          <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
            <span
              className={`w-6 h-6 ${
                step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-100"
              } 

      border border-gray-200 rounded-full flex justify-center items-center mr-3 

      lg:w-10 lg:h-10`}
            >
              2
            </span>
            Verify OTP
          </div>
        </li>

        <li
          className={`flex md:w-full items-center ${
            step >= 3 ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <div className="flex items-center">
            <span
              className={`w-6 h-6 ${
                step >= 3 ? "bg-indigo-600 text-white" : "bg-gray-100"
              } 

      border border-gray-200 rounded-full flex justify-center items-center mr-3 

      lg:w-10 lg:h-10`}
            >
              3
            </span>
            Reset Password
          </div>
        </li>
      </ol>
      <div className="max-w-md mx-auto">
        {step === 1 && (
          <form onSubmit={requestOtp} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">
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
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">
              Reset Password
            </h2>
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
                className="absolute top-1/2 right-3 -translate-y-1/2"
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-gray-500"
                />
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
