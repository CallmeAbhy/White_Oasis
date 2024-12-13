import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ResetPassword from "./components/ResetPassword";
import UserDetail from "./components/UserDetail";
import { TokenProvider } from "./context/TokenContext";

const App = () => {
  return (
    <TokenProvider>
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/user-detail" element={<UserDetail />} />
            </Routes>
          </Router>
        </ProfileProvider>
      </AuthProvider>
    </TokenProvider>
  );
};

export default App;
