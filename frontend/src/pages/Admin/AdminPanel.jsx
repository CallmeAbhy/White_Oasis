// AdminPanel.jsx
import { useState } from "react";
import { useToken } from "../../context/TokenContext";
import Navbar from "../../components/Navbar";
import { Tab } from "@headlessui/react";
import ContactForm from "../Common/Components/ContactForm";
import Footer from "../Common/Components/Footer";
import HomeContentTab from "../Common/Components/HomeContentTab";
import AboutContent from "../Common/Components/AboutContent";

const AdminPanel = () => {
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <Tab.Group>
          <Tab.List className="flex space-x-4 border-b mb-6">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 font-medium ${
                  selected
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              Home Content
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 font-medium ${
                  selected
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              About Us Content
            </Tab>
          </Tab.List>
          <Tab.Panels>
            {/* Home Content */}
            <Tab.Panel>
              <HomeContentTab
                token={token}
                loading={loading}
                setLoading={setLoading}
                message={message}
                setMessage={setMessage}
              />
            </Tab.Panel>
            {/* About Us Content */}
            <Tab.Panel>
              <AboutContent
                token={token}
                loading={loading}
                setLoading={setLoading}
                setMessage={setMessage}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
      <ContactForm />
      <Footer />
    </>
  );
};

export default AdminPanel;
