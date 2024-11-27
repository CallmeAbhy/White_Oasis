// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:7001/api/auth/login",
        {
          username,
          password,
        }
      );
      console.log(response.data); // Handle successful login (e.g., save token)
      const { token } = response.data;
      localStorage.setItem("token", token); // Store token
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.response.data.message);
      console.error(error);
    }
  };
  // https://www.blackbox.ai/chat/i0mdZkG
  return (
    <form onSubmit={handleSubmit}>
      <label>Username:</label>

      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <br />

      <label>Password:</label>

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <br />

      {error && <div style={{ color: "red" }}>{error}</div>}

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
