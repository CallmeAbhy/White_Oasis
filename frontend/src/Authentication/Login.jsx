// src/components/Login.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { navigateToHome } from "../utils/navigationUtils";
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
            "Content-Type": "application/json ",
          },
        }
      );
      const { token } = response.data;
      // const { _id } = profile;
      // console.log(`The ID of ${profile.role} is ${_id}`);
      // localStorage.setItem("token", token);
      // navigate("/", { state: { profile } });
      updateToken(token);
      navigate(`/`);
      // navigateToHome(navigate, _id);
    } catch (error) {
      alert("Login failed: " + error.response.data.message);
    }
  };

  return (
    <section
      className="bg-gray-50 min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://storage.googleapis.com/a1aa/image/6b1a82a1-b6b6-4003-ae6f-815a0e875b31.jpeg')`,
        backgroundSize: "cover",
      }}
    >
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
          <p className="text-xs mt-4 text-[#002D74]">
            If you are already a member, easily log in
          </p>
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleLogin}
          >
            <CommonFields
              formData={formData}
              handleChange={handleChange}
              usernameClass="mt-8"
              passwordClass="w-full"
            />
            {/* <input
              type="text"
              placeholder="Username"
              name="username"
              className="p-2 mt-8 rounded-xl border"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                className="p-2 rounded-xl border w-full"
                value={formData.password}
                onChange={handleChange}
                required
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
            </div> */}
            <button
              type="submit"
              className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 duration-300"
            >
              Login
            </button>
          </form>
          <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
            <a href="/reset">Forgot your password?</a>
          </div>

          <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
            <p>Dont have an account?</p>
            <button
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300 "
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
        <div className="md:block hidden w-1/2">
          <img
            className="rounded-2xl"
            src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
