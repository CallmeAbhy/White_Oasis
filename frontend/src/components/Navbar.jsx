// src/components/Navbar.jsx
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useToken } from "../context/TokenContext";
import PropTypes from "prop-types";
import { navigateToLogin } from "../utils/navigationUtils";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "About us", href: "#", current: false },
  { name: "Near Me", href: "/near-me", current: false },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const Navbar = () => {
  const { profile, setProfile } = useProfile();
  const location = useLocation();
  const { token, updateToken } = useToken();
  const [pendingCount, setPendingCount] = useState(0);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const navigate = useNavigate();
  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const fetchPendingCount = async () => {
      switch (profile.role) {
        case "admin":
          try {
            const response = await fetch(
              "http://localhost:7001/api/admin/pending-managers",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            setPendingCount(data.length);
          } catch (e) {
            console.error("Error Fetching the Pending Managers", e);
          }
          break;
        case "manager":
          try {
            const response = await fetch(
              "http://localhost:7001/api/appointments/pending/Pending",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            console.log(data);
            const { count } = data;
            setPendingCount(count);
          } catch (error) {
            console.error("Error Fetching the Pending Appointments", error);
          }
          break;
        case "user":
          try {
            const response = await fetch(
              "http://localhost:7001/api/appointments/notifications/count",
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            console.log(data);
            if (data.success) {
              setPendingCount(data.counts.total);
            }
          } catch (error) {
            console.error("Error Fetching the Pending Approval", error);
          }
          break;
        default:
          break;
      }
    };
    fetchPendingCount();
  }, [profile, token]);

  const getProfileImage = () => {
    if (!profile) return null;
    return profile.role === "admin"
      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShT46qRS5GB1TODvjapsbE5sYDtc1xxgMfzQ&s"
      : `http://localhost:7001/api/files/file/${
          profile.userPhoto || profile.trust_logo
        }`;
  };

  const handleLogout = () => {
    updateToken(null);
    setProfile(null);
    navigateToLogin(navigate);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="https://i.postimg.cc/s2BpMXk4/svgviewer-png-output.png"
              alt="Logo"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isCurrentPath(item.href)
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300",
                  "px-3 py-2 text-sm font-medium transition duration-200"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Notification and Profile */}
          <div className="flex items-center space-x-4">
            {profile && profile.role === "admin" && (
              <>
                <button
                  className="relative focus:outline-none"
                  onClick={() => navigate("/dashboard")}
                >
                  <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </>
            )}
            {profile && profile.role !== "admin" && (
              <>
                <button
                  className="relative focus:outline-none"
                  onClick={() => navigate("/managerdashboard")}
                >
                  <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* Profile Section */}
            {profile ? (
              <div className="relative">
                <img
                  src={getProfileImage()}
                  alt="Profile"
                  className="h-8 w-8 rounded-full cursor-pointer"
                  onClick={() => setShowProfileCard(!showProfileCard)}
                />
                {showProfileCard && (
                  <div className="fixed top-16 right-4 w-80 max-w-xs bg-white shadow-xl rounded-lg border border-gray-200 z-50 overflow-auto">
                    {/* Profile Card Header with Image */}
                    <div className="flex flex-col items-center justify-center border-b border-gray-200 px-4 py-4">
                      <img
                        src={getProfileImage()}
                        alt="User Profile"
                        className="h-20 w-20 rounded-full border-2 border-gray-300"
                      />
                      <div className="mt-2 text-center">
                        <p className="text-lg font-semibold text-gray-800">
                          {profile.username}
                        </p>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="px-4 py-3 text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Role:</span>
                        <span>{profile.role || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Joined On:</span>
                        <span>
                          {profile.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString()
                            : "Not Available"}
                        </span>
                      </div>
                      {profile.location && (
                        <div className="flex justify-between">
                          <span className="font-medium">Location:</span>
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.organization && (
                        <div className="flex justify-between">
                          <span className="font-medium">Organization:</span>
                          <span>{profile.organization}</span>
                        </div>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-gray-200">
                      <button
                        className="block w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Log in
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <Bars3Icon className="block h-6 w-6" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={classNames(
                isCurrentPath(item.href)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "block px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

Navbar.propTypes = {
  profile: PropTypes.object,
};

export default Navbar;
