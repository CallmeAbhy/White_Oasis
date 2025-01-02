// Home.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProfile } from "../../context/ProfileContext";
import { useToken } from "../../context/TokenContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUserNurse,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faClock,
  faCalendarAlt,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { validateEmail } from "../../utils/Vallidator";
import { IntroVideo } from "./IntroVideo";

const Home = () => {
  const { setProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useToken();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [homeSection, SetHomeSection] = useState({
    title: "",
    subtitle: "",
    heroImages: "",
    desktopVideo: "",
    mobileVideo: "",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [hasSkippedVideo, setHasSkippedVideo] = useState(
    localStorage.getItem("hasSkippedIntroVideo") === "true"
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch profile if token exists

        if (token) {
          try {
            const profileResponse = await axios.get(
              `http://localhost:7001/api/users/profile`,

              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setProfile(profileResponse.data);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        }

        // Fetch home section data

        const homeSectionResponse = await axios.get(
          "http://localhost:7001/api/landing",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const jsondata = homeSectionResponse.data;

        SetHomeSection({
          title: jsondata.title,

          subtitle: jsondata.subtitle,

          heroImages: jsondata.currentDayImage.url,

          desktopVideo: jsondata.heroVideoBig.url,

          mobileVideo: jsondata.heroVideoSmall.url,

          email: jsondata.email,

          phone: jsondata.phone,

          facebook: jsondata.facebook,

          twitter: jsondata.twitter,

          instagram: jsondata.instagram,

          address: jsondata.address,

          youtube: jsondata.youtube,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, setProfile]);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSkipVideo = useCallback(() => {
    setShowIntroVideo(false);

    setHasSkippedVideo(true);

    localStorage.setItem("hasSkippedIntroVideo", "true");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate all required fields
    if (!formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7001/api/contact/send",
        {
          fromEmail: formData.email,
          toEmail: "abhaydusane24@gmail.com", // The email where you want to receive messages
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
        // Clear form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response?.status === 400) {
        alert("Please provide all required fields");
      } else {
        alert("Failed to send message. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!hasSkippedVideo && showIntroVideo && homeSection.desktopVideo ? (
        <IntroVideo
          onSkip={handleSkipVideo}
          desktopVideo={homeSection.desktopVideo}
          mobileVideo={homeSection.mobileVideo}
        />
      ) : (
        <>
          <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[90vh]">
              <div className="absolute inset-0">
                <img
                  src={homeSection.heroImages || "/images/elderly-care.jpg"}
                  className="w-full h-full object-cover"
                  alt="Elderly Care"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl font-bold mb-6">
                    {homeSection.title ||
                      "Compassionate Elderly Care for Elders"}
                  </h1>
                  <p className="text-xl mb-8">{homeSection.subtitle}</p>
                  <button
                    onClick={() => navigate("/near-me")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
                  >
                    Find Care Homes
                  </button>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-16">
                  Our Services
                </h2>
                <div className="grid md:grid-cols-4 gap-8">
                  {[
                    {
                      icon: faUserNurse,
                      title: "24/7 Medical Care",
                      description:
                        "Round-the-clock medical supervision and support",
                    },
                    {
                      icon: faUserFriends,
                      title: "Social Activities",
                      description:
                        "Engaging social programs and community events",
                    },
                    {
                      icon: faCalendarAlt,
                      title: "Scheduled Care",
                      description:
                        "Personalized care plans and daily assistance",
                    },
                    {
                      icon: faClock,
                      title: "Emergency Support",
                      description: "Immediate response to emergency situations",
                    },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300"
                    >
                      <FontAwesomeIcon
                        icon={service.icon}
                        className="text-4xl text-blue-600 mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="bg-gray-100 py-20">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Experience Our Care
                  </h2>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      paddingTop: "56.25%",
                    }}
                  >
                    <iframe
                      src="https://share.synthesia.io/embeds/videos/bfd135ac-0ab9-400e-93d7-c513cc4530fd"
                      loading="lazy"
                      title="Synthesia video player - Your AI video"
                      allowFullScreen
                      allow="encrypted-media; fullscreen;"
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        border: "none",
                        padding: 0,
                        margin: 0,
                        overflow: "hidden",
                      }}
                    ></iframe>
                  </div>{" "}
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-12">
                    Contact Us
                  </h2>
                  <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4">
                        Get in Touch
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <FontAwesomeIcon
                            icon={faPhone}
                            className="text-blue-600 w-5"
                          />
                          <span>{homeSection.phone}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="text-blue-600 w-5"
                          />
                          <span>{homeSection.email}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="text-blue-600 w-5"
                          />
                          <span>{homeSection.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Your Email"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Subject"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Your Message"
                          rows="4"
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
              <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Company Info */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">White Oasis</h3>
                    <p className="text-gray-400 mb-4">{homeSection.subtitle}</p>

                    <div className="flex space-x-4">
                      {homeSection && homeSection.facebook && (
                        <>
                          <a
                            href={homeSection.facebook}
                            target="_blank"
                            className="text-gray-400 hover:text-white transition"
                          >
                            <FontAwesomeIcon icon={faFacebook} size="lg" />
                          </a>
                        </>
                      )}
                      {homeSection && homeSection.twitter && (
                        <>
                          <a
                            href={homeSection.twitter}
                            target="_blank"
                            className="text-gray-400 hover:text-white transition"
                          >
                            <FontAwesomeIcon icon={faTwitter} size="lg" />
                          </a>
                        </>
                      )}
                      {homeSection && homeSection.instagram && (
                        <>
                          <a
                            href={homeSection.instagram}
                            target="_blank"
                            className="text-gray-400 hover:text-white transition"
                          >
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                          </a>
                        </>
                      )}
                      {homeSection && homeSection.youtube && (
                        <>
                          <a
                            href={homeSection.youtube}
                            target="_blank"
                            className="text-gray-400 hover:text-white transition"
                          >
                            <FontAwesomeIcon icon={faYoutube} size="lg" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-white transition"
                        >
                          About Us
                        </a>
                      </li>
                      <li>
                        <a
                          href="/near-me"
                          className="text-gray-400 hover:text-white transition"
                        >
                          Find Care Homes
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Services */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Our Services</h3>
                    <ul className="space-y-2">
                      <li className="text-gray-400">24/7 Care Support</li>
                      <li className="text-gray-400">Medical Assistance</li>
                      <li className="text-gray-400">Recreational Activities</li>
                      <li className="text-gray-400">
                        Specialized Care Programs
                      </li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                    <ul className="space-y-2">
                      <li className="text-gray-400 flex items-center">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="mr-2"
                        />
                        {homeSection.address}
                      </li>
                      <li className="text-gray-400 flex items-center">
                        <FontAwesomeIcon icon={faPhone} className="mr-2" />
                        {homeSection.phone}
                      </li>
                      <li className="text-gray-400 flex items-center">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                        {homeSection.email}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400">
                      © {new Date().getFullYear()} White Oasis. All rights
                      reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition"
                      >
                        Privacy Policy
                      </a>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition"
                      >
                        Terms of Service
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
