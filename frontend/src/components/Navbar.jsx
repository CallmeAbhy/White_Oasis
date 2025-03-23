// src/components/Navbar.jsx

/* 
@@Image
Create a logo folder under the images
the path will be src/assets/images/logo
Add the Desktop and Mobile Compatible Image for logo there
Do as Step 2
*/

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { useToken } from "../context/TokenContext";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
/* Step 2: Import the Desktop and Mobile Image
import DesktopImage from "../assets/images/logo/Desktop.png";
import MobileImage from "../assets/images/logo/Mobile.png"; */
const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "About us", href: "/about-us", current: false },
  { name: "Near Me", href: "/near-me", current: false },
  { name: "Services", href: "/#services", current: false, isSpecial: true },
];

const Navbar = () => {
  const { profile, setProfile } = useProfile();
  const { token, updateToken } = useToken();
  const [activePanel, setActivePanel] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [notificationStats, setNotificationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentPath = (path) => location.pathname === path;

  const navigateToServices = useCallback(() => {
    if (location.pathname !== "/") {
      navigate("/#services");
    } else {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#services") {
      setTimeout(() => {
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);
  useEffect(() => {
    const fetchNotificationStats = async () => {
      if (!profile || !token) {
        setPendingCount(0);
        setNotificationStats({ pending: 0, approved: 0, rejected: 0 });
        return;
      }

      try {
        switch (profile.role) {
          case "admin": {
            const adminResponse = await fetch(
              `${import.meta.env.VITE_API_URL}/api/admin/pending-managers`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const adminData = await adminResponse.json();
            setPendingCount(adminData.length || 0);
            setNotificationStats({
              pending: adminData.length || 0,
              approved: 0,
              rejected: 0,
            });
            break;
          }

          case "manager": {
            const managerResponse = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/appointments/home/notification/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const managerData = await managerResponse.json();
            if (managerData.success) {
              setNotificationStats({
                pending: managerData.counts.pending || 0,
                approved: managerData.counts.approved || 0,
                rejected: managerData.counts.rejected || 0,
              });
              setPendingCount(managerData.counts.pending || 0);
            }
            break;
          }

          case "user": {
            const userResponse = await fetch(
              `${
                import.meta.env.VITE_API_URL
              }/api/appointments/notifications/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const userData = await userResponse.json();
            if (userData.success) {
              setNotificationStats({
                pending: userData.counts.pending || 0,
                approved: userData.counts.approved || 0,
                rejected: userData.counts.rejected || 0,
              });
              setPendingCount(userData.counts.pending || 0);
            }
            break;
          }

          default: {
            setPendingCount(0);
            setNotificationStats({ pending: 0, approved: 0, rejected: 0 });
            break;
          }
        }
      } catch (error) {
        console.error(`Error fetching ${profile.role} notifications:`, error);
        setPendingCount(0);
        setNotificationStats({ pending: 0, approved: 0, rejected: 0 });
      }
    };

    fetchNotificationStats();
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
    navigate("/login");
  };

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-lg fixed w-full top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex-shrink-0">
                <Link to="/">
                  <img
                    className="h-10 w-auto md:hidden transition-transform hover:scale-105 duration-300"
                    src="https://i.imghippo.com/files/waZ7239cew.png"
                    // Step 3 : Uncomment the given line and comment the above line
                    // src={MobileImage}
                    alt="Mobile Logo"
                  />
                  <img
                    className="hidden md:block h-12 w-auto transition-transform hover:scale-105 duration-300"
                    src="https://i.imghippo.com/files/XPEy3112qw.png"
                    // Step 3 : Uncomment the given line and comment the above line
                    // src={DesktopImage}
                    alt="Desktop Logo"
                  />
                </Link>
              </div>

              <div className="hidden lg:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) =>
                      (item.isSpecial && e.preventDefault()) ||
                      navigateToServices()
                    }
                    className={`relative px-1 py-2 text-sm font-medium transition-all duration-200 ${
                      isCurrentPath(item.href) ||
                      (item.href === "/#services" &&
                        location.hash === "#services")
                        ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-indigo-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                {profile && (
                  <>
                    <Popover className="relative">
                      <Popover.Button
                        onClick={() => togglePanel("notifications")}
                        className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none"
                      >
                        <BellIcon className="h-6 w-6" />
                        {pendingCount > 0 && (
                          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                        )}
                      </Popover.Button>
                      <Transition
                        show={activePanel === "notifications"}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Notifications
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-yellow-600">
                              <span>Pending</span>
                              <span>{notificationStats.pending}</span>
                            </div>
                            {profile.role !== "admin" && (
                              <>
                                <div className="flex justify-between text-green-600">
                                  <span>Approved</span>
                                  <span>{notificationStats.approved}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                  <span>Rejected</span>
                                  <span>{notificationStats.rejected}</span>
                                </div>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              navigate(
                                profile.role === "admin"
                                  ? "/dashboard"
                                  : profile.role === "manager"
                                  ? "/managerdashboard"
                                  : "/UserDashboard"
                              )
                            }
                            className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                          >
                            View Dashboard
                          </button>
                        </Popover.Panel>
                      </Transition>
                    </Popover>

                    <Popover className="relative">
                      <Popover.Button
                        onClick={() => togglePanel("profile")}
                        className="focus:outline-none"
                      >
                        <img
                          src={getProfileImage()}
                          alt="Profile"
                          className="h-8 w-8 rounded-full border-2 border-gray-200 hover:border-indigo-300 transition-colors"
                        />
                      </Popover.Button>
                      <Transition
                        show={activePanel === "profile"}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getProfileImage()}
                              alt="Profile"
                              className="h-12 w-12 rounded-full border-2 border-indigo-100"
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {profile.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {profile.email}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Role:</span>
                              <span className="font-medium">
                                {profile.role}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Joined:</span>
                              <span className="font-medium">
                                {new Date(
                                  profile.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {profile.role === "admin" && (
                            <button
                              onClick={() => navigate("/panel")}
                              className="w-full mt-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              Settings
                            </button>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full mt-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Logout
                          </button>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  </>
                )}
                {!profile && (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    Log in
                  </Link>
                )}
                <DisclosureButton className="lg:hidden p-2 rounded-full text-gray-600 hover:text-gray-800">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={item.isSpecial ? "button" : Link}
                  to={!item.isSpecial ? item.href : undefined}
                  onClick={item.isSpecial ? navigateToServices : undefined}
                  className={`block w-full text-left px-3 py-2 text-base font-medium ${
                    isCurrentPath(item.href)
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                  } rounded-md transition-colors`}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
