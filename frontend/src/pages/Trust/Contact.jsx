import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useProfile } from "../../context/ProfileContext";
import { useToken } from "../../context/TokenContext";
import { validateEmail } from "../../utils/Vallidator";

const Contact = () => {
  const { state } = useLocation();
  console.log(state);
  const { profile } = useProfile();
  const { token } = useToken();
  const [formData, setFormData] = useState({
    name: "",
    email: profile?.email || "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Validate email
    if (!validateEmail(formData.email)) {
      setStatus("Error! Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:7001/api/contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromEmail: formData.email,
          toEmail: state.email,
          subject: `Message from ${formData.name}`,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus("Success! Your message has been sent.");
        setFormData({
          name: "",
          email: profile?.email || "",
          message: "",
        });
      } else {
        const data = await response.json();
        setStatus(`Error! ${data.message}`);
      }
    } catch (error) {
      setStatus("Error! Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {state.name}
        </h2>
        <div className="flex flex-wrap gap-8">
          {/* Contact Info Section */}
          <div className="flex-1 bg-gray-100 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              Contact Information
            </h3>
            <div className="mb-6">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-indigo-500 mr-2"
              />
              <h4 className="inline-block text-lg font-medium text-gray-600">
                Phone Numbers:
              </h4>
              {state.contact_numbers.map(
                (number, index) =>
                  number && (
                    <p key={index} className="ml-8 mt-2 text-gray-800">
                      <a
                        href={`tel:${number}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {number}
                      </a>
                    </p>
                  )
              )}
            </div>

            <div className="mb-6">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-indigo-500 mr-2"
              />
              <h4 className="inline-block text-lg font-medium text-gray-600">
                Email:
              </h4>
              <p className="ml-8 mt-2 text-gray-800">
                <a
                  href={`mailto:${state.email}`}
                  className="text-indigo-600 hover:underline"
                >
                  {state.email}
                </a>
              </p>
            </div>

            <div>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-indigo-500 mr-2"
              />
              <h4 className="inline-block text-lg font-medium text-gray-600">
                Address:
              </h4>
              <p className="ml-8 mt-2 text-gray-800">{state.address}</p>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-600"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              {status && (
                <div
                  className={`text-sm font-semibold ${
                    status.includes("Success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg text-white ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
