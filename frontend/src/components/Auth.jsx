import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div>
      {isLogin ? <Login /> : <Signup />}

      <button onClick={toggleForm}>
        {isLogin ? "Switch to Signup" : "Switch to Login"}
      </button>
    </div>
  );
};
export default Auth;
