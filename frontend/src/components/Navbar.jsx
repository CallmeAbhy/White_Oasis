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
import { Popover } from "@headlessui/react";
import {
  navigateToLogin,
  navigateToPanel,
  navigateToUserDashboard,
} from "../utils/navigationUtils";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "About us", href: "/about-us", current: false },
  { name: "Near Me", href: "/near-me", current: false },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const Navbar = () => {
  const { profile, setProfile } = useProfile();
  const location = useLocation();
  const { token, updateToken } = useToken();
  const [pendingCount, setPendingCount] = useState(0);
  const [notificationStats, setNotificationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
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
              `${import.meta.env.VITE_API_URL}/api/admin/pending-managers`,
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
              `${
                import.meta.env.VITE_API_URL
              }/api/appointments/home/notification/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            if (data.success) {
              setNotificationStats({
                pending: data.counts.pending,
                approved: data.counts.approved,
                rejected: data.counts.rejected,
              });
            }
          } catch (error) {
            console.error("Error Fetching the Pending Appointments", error);
          }
          break;
        case "user":
          try {
            const response = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/appointments/notifications/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await response.json();
            if (data.success) {
              setNotificationStats({
                pending: data.counts.pending,
                approved: data.counts.approved,
                rejected: data.counts.rejected,
              });
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
      : `${import.meta.env.VITE_API_URL}/api/files/file/${
          profile.userPhoto || profile.trust_logo
        }`;
  };

  const handleLogout = () => {
    updateToken(null);
    setProfile(null);
    localStorage.removeItem("hasSkippedIntroVideo");
    navigateToLogin(navigate);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-10 w-auto md:hidden transition-transform duration-300 transform hover:scale-110"
              src="https://i.imghippo.com/files/waZ7239cew.png"
              alt="Mobile Logo"
              onClick={() => navigate("/")}
            />

            {/* Desktop Logo */}
            <img
              className="h-20 w-auto hidden md:block transition-transform duration-300 transform hover:scale-110"
              src="https://i.imghippo.com/files/XPEy3112qw.png"
              alt="Desktop Logo"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  isCurrentPath(item.href)
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300",
                  "px-3 py-2 text-sm font-semibold transition-all duration-200"
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

            {profile && profile.role === "manager" && (
              <div className="relative">
                <Popover className="relative">
                  <Popover.Button className="relative focus:outline-none">
                    <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                    {(notificationStats.pending > 0 ||
                      notificationStats.approved > 0 ||
                      notificationStats.rejected > 0) && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">
                        {notificationStats.pending}
                      </span>
                    )}
                  </Popover.Button>

                  <Popover.Panel className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Notification Stats
                    </h3>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-yellow-500">
                        <span>Pending</span>
                        <span className="font-semibold">
                          {notificationStats.pending || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-green-500">
                        <span>Approved</span>
                        <span className="font-semibold">
                          {notificationStats.approved || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-red-500">
                        <span>Rejected</span>
                        <span className="font-semibold">
                          {notificationStats.rejected || 0}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate("/managerdashboard")}
                      className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all text-sm"
                    >
                      View Dashboard
                    </button>
                  </Popover.Panel>
                </Popover>
              </div>
            )}
            {profile && profile.role === "user" && (
              <div className="relative">
                <Popover className="relative">
                  <Popover.Button className="relative focus:outline-none">
                    <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
                    {(notificationStats.pending > 0 ||
                      notificationStats.approved > 0 ||
                      notificationStats.rejected > 0) && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">
                        {notificationStats.pending}
                      </span>
                    )}
                  </Popover.Button>

                  <Popover.Panel className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Notification Stats
                    </h3>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-yellow-500">
                        <span>Pending</span>
                        <span className="font-semibold">
                          {notificationStats.pending || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-green-500">
                        <span>Approved</span>
                        <span className="font-semibold">
                          {notificationStats.approved || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-red-500">
                        <span>Rejected</span>
                        <span className="font-semibold">
                          {notificationStats.rejected || 0}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateToUserDashboard(navigate)}
                      className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all text-sm"
                    >
                      View Dashboard
                    </button>
                  </Popover.Panel>
                </Popover>
              </div>
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
                  <div className="absolute top-16 right-4 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                    {/* Profile Card Header with Image */}
                    <div className="flex flex-col items-center p-4 border-b border-gray-200">
                      <img
                        src={getProfileImage()}
                        alt="User  Profile"
                        className="h-16 w-16 rounded-full border-2 border-gray-300"
                      />

                      <p className="mt-2 text-lg font-semibold text-gray-800">
                        {profile.username}
                      </p>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>

                    {/* Profile Details */}
                    <div className="p-3 space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Role:</span>
                        <span>{profile.role || "Guest"}</span>
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

                    {/* Additional Settings Option for Admin */}
                    {profile.role === "admin" && (
                      <div className="border-t border-gray-200">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm font-medium text-blue-600 hover:bg-gray-100"
                          onClick={() => navigateToPanel(navigate)}
                        >
                          Settings
                        </button>
                      </div>
                    )}

                    {/* Logout Button */}
                    <div className="border-t border-gray-200">
                      <button
                        className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <Bars3Icon className="block h-6 w-6" />
            </DisclosureButton>
          </div>
          {/* <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-4 pb-3 pt-2 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    isCurrentPath(item.href)
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "block px-3 py-2 text-base font-medium rounded-md"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </DisclosurePanel> */}
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
