// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import Login from "./components/Login"; // Import Login component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Login />} />{" "}
        {/* Define the login route */}
        <Route path="/signup" element={<Auth />} />{" "}
        {/* You can also define a separate signup route if needed */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add other routes as necessary */}
      </Routes>
    </Router>
  );
};

export default App;
