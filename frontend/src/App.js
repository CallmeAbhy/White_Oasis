import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Optionally decode the token to get user info (requires a library like jwt-decode)

      // const decodedToken = jwt_decode(token);

      // setUser (decodedToken);

      setUser({ role: "user" }); // Mock user role for demonstration
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout

    setUser(null); // Update user state
  };
  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
