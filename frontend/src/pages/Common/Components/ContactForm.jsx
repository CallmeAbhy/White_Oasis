// src/components/ContactForm.jsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useToken } from "../../../context/TokenContext";
import { useHome } from "../../../context/HomeContext";
import { validateForm } from "../../../utils/Vallidator";
import { useApiErrorHandler } from "../../../utils/apiErrorHandler";
import { useError } from "../../../context/ErrorContext";

const ContactForm = () => {
  const { token } = useToken();
  const homedata = useHome();
  const { showError } = useError();
  const { handleApiError } = useApiErrorHandler();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationRules = {
      name: { required: true },
      email: { required: true, email: true },
      subject: { required: true },
      message: { required: true, minLength: 10 },
    };

    const { isValid, errors } = validateForm(formData, validationRules);

    if (!isValid) {
      const firstError = Object.values(errors)[0];
      showError(firstError);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact/send`,
        {
          fromEmail: formData.email,
          toEmail: "abhaydusane24@gmail.com",
          subject: formData.subject,
          message: `Name: ${formData.name}\n${formData.message}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-blue-600 w-5"
                  />
                  <span>{homedata.phone}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-blue-600 w-5"
                  />
                  <span>{homedata.email}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-blue-600 w-5"
                  />
                  <span>{homedata.address}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form inputs */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Subject"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                rows="4"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactForm;
