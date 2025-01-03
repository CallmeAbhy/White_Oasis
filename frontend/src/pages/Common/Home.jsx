// Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useProfile } from "../../context/ProfileContext";
import { useToken } from "../../context/TokenContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserNurse,
  faClock,
  faCalendarAlt,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
import { IntroVideo } from "./IntroVideo";
import Footer from "./Components/Footer";
import ContactForm from "./Components/ContactForm";
import { useHome } from "../../context/HomeContext";

const Home = () => {
  const { setProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useToken();
  const homeData = useHome();
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    if (!token) {
      setShowIntro(true);
    }
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, setProfile]);

  const handleSkipIntro = () => {
    setShowIntro(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showIntro && homeData.desktopVideo ? (
        <IntroVideo
          onSkip={handleSkipIntro}
          desktopVideo={homeData.desktopVideo}
          mobileVideo={homeData.mobileVideo}
        />
      ) : (
        <>
          <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[90vh]">
              <div className="absolute inset-0">
                <img
                  src={homeData.heroImages || "/images/elderly-care.jpg"}
                  className="w-full h-full object-cover"
                  alt="Elderly Care"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              <div className="relative container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl font-bold mb-6">
                    {homeData.title || "Compassionate Elderly Care for Elders"}
                  </h1>
                  <p className="text-xl mb-8">{homeData.subtitle}</p>
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
            <ContactForm />

            {/* Footer */}
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
