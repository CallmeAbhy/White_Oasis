// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login"; // Import Login component
import Home from "./components/Home";
import ResetPassword from "./components/ResetPassword";
import Signup from "./components/Signup";
import { AuthProvider } from "./context/AuthContext";
import UserDetail from "./components/UserDetail";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home/:id" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/user-detail" element={<UserDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
