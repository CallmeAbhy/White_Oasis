// src/components/Navbar.jsx
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { navigateToDashboard, navigateToLogin } from "../utils/navigationUtils";

const navigation = [
  { name: "Home", href: "/home", current: true },
  { name: "About us", href: "#", current: false },
  { name: "Near Me", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({ profile }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [showProfileCard, setShowProfileCard] = useState(false); // Toggle profile card
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleRoute = () => {
    // navigate("/dashboard", { state: { profile } });
    navigateToDashboard(navigate, profile);
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    // navigate("/login"); // Redirect to login
    navigateToLogin(navigate);
  };

  useEffect(() => {
    const fetchPendingCount = async () => {
      if (profile && profile.role === "admin") {
        try {
          const response = await fetch(
            "http://localhost:7001/api/admin/pending-managers",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setPendingCount(data.length);
        } catch (e) {
          console.error("Error Fetching the Pending Managers", e);
        }
      }
    };
    fetchPendingCount();
  }, [profile, token]);

  const getProfileImage = () => {
    if (!profile) return null;

    switch (profile.role) {
      case "user":
        return `http://localhost:7001/api/files/file/${profile.userPhoto}`;
      case "manager":
        return `http://localhost:7001/api/files/file/${profile.trust_logo}`;
      case "admin":
        return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXvRLjvJ-BNF3VEjaP-c9Q-fentb3KZ-t5qw&s";
      default:
        return null;
    }
  };
  const color =
    profile && profile.role
      ? profile.role === "admin"
        ? "red-700"
        : profile.role === "user"
        ? "green-700"
        : profile.role === "manager"
        ? "yellow-700"
        : ""
      : "";

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {profile && profile.role === "admin" && (
                <button
                  type="button"
                  onClick={handleRoute}
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center size-5 rounded-full bg-red-600 text-xs font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )}

              {/* Profile dropdown */}
              {profile && Object.keys(profile).length > 0 ? (
                <div className="relative">
                  <img
                    alt=""
                    src={getProfileImage()}
                    className="size-8 rounded-full cursor-pointer"
                    onClick={() => setShowProfileCard(!showProfileCard)}
                    onError={(e) => {
                      e.target.src =
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRie6cb68TecGvf-EMmE-UocOT1soxDR6abNA&s";
                    }}
                  />
                  {showProfileCard && (
                    <div className="absolute right-0 mt-2 w-80 max-w-sm rounded-lg border bg-white px-4 pt-8 pb-10 shadow-lg z-50">
                      <div className="relative mx-auto w-24 h-24 rounded-full mb-4">
                        <img
                          src={getProfileImage()}
                          alt="Logo"
                          className="h-full w-full rounded-full border"
                        />
                        <span
                          className={`absolute bottom-1 right-1 h-3 w-3 rounded-full bg-${color} ring-2 ring-white`}
                        ></span>
                      </div>
                      <h1 className="text-center text-xl font-bold leading-8 text-gray-900">
                        {profile.username}
                      </h1>
                      <h3 className="text-center text-sm leading-6 text-gray-600">
                        {profile.email}
                      </h3>
                      <p className="text-center text-sm leading-6 text-gray-500">
                        Phone: {profile.phone}
                      </p>
                      <ul className="mt-4 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
                        <li className="flex items-center justify-between py-3 text-sm">
                          <span>Status</span>
                          <span
                            className={`rounded-full bg-${color} py-1 px-2 text-xs font-medium text-gray-100`}
                          >
                            {profile.role}
                          </span>
                        </li>
                        <li className="flex items-center justify-between py-3 text-sm">
                          <span>Joined On</span>
                          <span>
                            {new Date(profile.createdAt).toLocaleDateString()}
                          </span>
                        </li>
                        <li className="flex items-center justify-between py-3 text-sm">
                          <button
                            className="text-red-600 hover:underline"
                            onClick={handleLogout}
                          >
                            Log Out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                  Log in
                </a>
              )}
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};
Navbar.propTypes = {
  profile: PropTypes.object,
};
export default Navbar;
