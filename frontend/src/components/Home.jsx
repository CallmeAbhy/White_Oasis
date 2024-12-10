import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
const navigation = [
  { name: "Home", href: "/home", current: true },
  { name: "About us", href: "#", current: false },
  { name: "Near Me", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // const location = useLocation();
  // const profile = location.state?.profile || {};
  useEffect(() => {
    const fetchProfile = async () => {
      if (id && token) {
        try {
          const response = await axios.get(
            `http://localhost:7001/api/users/profile/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProfile(response.data);
        } catch (e) {
          console.error(`Error Fetching Profile`, e);
          navigate("/login");
        } finally {
          setLoading(false);
        }
      } else {
        // If no ID or token, just set loading to false
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate, token]);

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
  if (loading) {
    return <div>Loading...</div>;
  }
  const getProfileImage = () => {
    if (!profile) return null;

    switch (profile.role) {
      case "user":
        return `http://localhost:7001/api/files/file/${profile.userPhoto}`; // Construct the URL for user photo

      case "manager":
        return `http://localhost:7001/api/files/file/${profile.trust_logo}`; // Construct the URL for manager logo

      case "admin":
        return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXvRLjvJ-BNF3VEjaP-c9Q-fentb3KZ-t5qw&s";

      default:
        return null;
    }
  };
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
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt=""
                        src={getProfileImage()}
                        className="size-8 rounded-full"
                        onError={(e) => {
                          e.target.src =
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRie6cb68TecGvf-EMmE-UocOT1soxDR6abNA&s";
                        }}
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        Your Profile
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
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

export default Home;
