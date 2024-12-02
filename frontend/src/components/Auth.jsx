import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword"; // Import the new component

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false); // State for reset password

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsResetPassword(false); // Reset the reset password state
  };

  const toggleResetPassword = () => {
    setIsResetPassword(!isResetPassword);
    setIsLogin(false); // Ensure login is not displayed when resetting password
  };

  return (
    <div>
      {isResetPassword ? <ResetPassword /> : isLogin ? <Login /> : <Signup />}

      <button onClick={toggleForm}>
        {isLogin ? "Switch to Signup" : "Switch to Login"}
      </button>

      {/* Show the "Forgot Password?" button only when on the Login form */}
      {isLogin && (
        <button onClick={toggleResetPassword}>
          {isResetPassword ? "Back to Login" : "Forgot Password?"}
        </button>
      )}
    </div>
  );
};

export default Auth;
