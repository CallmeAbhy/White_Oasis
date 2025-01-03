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
import CreateOldAgeHome from "./pages/Trust/CreateOldAgeHome";
import About from "./pages/Trust/About";
import ManagerDashboard from "./pages/Trust/pages/ManagerDashboard";
import BookAppointment from "./pages/User/BookAppointment";
import UserDashboard from "./pages/User/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/Admin/AdminPanel";
import { HomeProvider } from "./context/HomeContext";

const App = () => {
  return (
    <TokenProvider>
      <AuthProvider>
        <ProfileProvider>
          <HomeProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset" element={<ResetPassword />} />
                <Route path="/near-me" element={<NearMe />} />
                {/* Protected Admin Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-detail"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <UserDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/panel"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                {/* Protected Manager Route */}
                <Route
                  path="/create-old-age-home"
                  element={
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <CreateOldAgeHome />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/managerdashboard"
                  element={
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <ManagerDashboard />
                    </ProtectedRoute>
                  }
                />
                {/* Protected User Route */}
                <Route
                  path="/UserDashboard"
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book-appointment/:homeId"
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <BookAppointment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/about/:id"
                  element={
                    <ProtectedRoute allowedRoles={["user", "manager", "admin"]}>
                      <About />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </HomeProvider>
        </ProfileProvider>
      </AuthProvider>
    </TokenProvider>
  );
};

export default App;
