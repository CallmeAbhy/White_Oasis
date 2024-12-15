import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenContext";
import CommonFields from "./Common/CommonFields";

const Login = () => {
  const { updateToken } = useToken();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/signup");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      const response = await axios.post(
        "http://localhost:7001/api/auth/login",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { token } = response.data;
      updateToken(token);
      navigate(`/`);
    } catch (error) {
      alert(
        "Login failed: " + error.response?.data?.message || "Unknown error"
      );
    }
  };

  return (
    <section
      className="bg-gray-50 min-h-screen flex items-center justify-center px-4 sm:px-6"
      style={{
        backgroundImage: `url('https://storage.googleapis.com/a1aa/image/6b1a82a1-b6b6-4003-ae6f-815a0e875b31.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Login Card */}
      <div className="bg-gray-100 flex flex-col-reverse md:flex-row rounded-2xl shadow-lg max-w-4xl w-full mx-4 sm:mx-6 md:mx-0 p-4 md:p-8 items-center">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 px-6 md:px-10">
          <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
          <p className="text-sm mt-3 text-[#002D74]">
            If you are already a member, easily log in.
          </p>

          {/* Form */}
          <form
            className="flex flex-col gap-4 mt-6"
            onSubmit={handleLogin}
            aria-label="Login Form"
          >
            <CommonFields
              formData={formData}
              handleChange={handleChange}
              usernameClass="mt-2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
              passwordClass="p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#002D74] text-white py-2 rounded-lg hover:scale-105 hover:shadow-md duration-300"
            >
              Login
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-5 text-sm border-b border-gray-300 py-2 text-[#002D74]">
            <a
              href="/reset"
              className="hover:text-[#004aad] duration-300"
              aria-label="Forgot Password"
            >
              Forgot your password?
            </a>
          </div>

          {/* Register Redirect */}
          <div className="mt-4 text-sm flex justify-between items-center text-[#002D74]">
            <p>Do not have an account?</p>
            <button
              onClick={handleRegister}
              className="py-2 px-4 bg-white border rounded-lg hover:scale-105 hover:shadow-md duration-300"
            >
              Register
            </button>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
            alt="Login Visual"
            className="rounded-2xl object-cover h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
