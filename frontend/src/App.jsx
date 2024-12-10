// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login"; // Import Login component
import Home from "./components/Home";

import ResetPassword from "./components/ResetPassword";
import Signup from "./components/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />{" "}
        <Route path="/home/:id" element={<Home />} />
        {/* Define the login route */}
        <Route path="/signup" element={<Signup />} />{" "}
        {/* You can also define a separate signup route if needed */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset" element={<ResetPassword />} />
        {/* Add other routes as necessary */}
      </Routes>
    </Router>
  );
};

export default App;
