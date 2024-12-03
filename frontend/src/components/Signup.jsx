import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    role: "",
  });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { username, password, email, phone, role } = formData;

      // Create FormData object
      const data = new FormData();
      data.append("username", username);
      data.append("password", password);
      data.append("email", email);
      data.append("phone", phone);
      data.append("role", role);

      const jsonData = {};
      data.forEach((value, key) => {
        jsonData[key] = value;
      });

      // Send signup request
      await axios.post("http://localhost:7001/api/auth/register", jsonData);
      alert("Signup successful! Logging you in...");

      // Now login the user automatically
      const response = await axios.post(
        "http://localhost:7001/api/auth/login",
        {
          username,
          password,
        }
      );
      setUser({ token: response.data.token, role });
      localStorage.setItem("token", response.data.token); // Store token for future requests
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      alert(
        "Signup failed: " + error.response?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option value="user">User </option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
