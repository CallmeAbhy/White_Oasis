import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Send signup request
      await axios.post("http://localhost:7001/api/auth/register", {
        username,
        password,
        email,
        phone,
        role,
      });
      alert("Signup successful! Logging you in...");

      // Now login the user automatically
      const response = await axios.post(
        "http://localhost:7001/api/auth/login",
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", response.data.token); // Store token for future requests
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      alert("Signup failed: " + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
