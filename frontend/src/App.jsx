import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import Home from "./pages/Common/Home";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import Dashboard from "./pages/Admin/Dashboard";
import ResetPassword from "./Authentication/ResetPassword";
import UserDetail from "./pages/Admin/UserDetail";
import { TokenProvider } from "./context/TokenContext";
import NearMe from "./pages/Common/NearMe";

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
              <Route path="/near-me" element={<NearMe />} />
            </Routes>
          </Router>
        </ProfileProvider>
      </AuthProvider>
    </TokenProvider>
  );
};

export default App;
