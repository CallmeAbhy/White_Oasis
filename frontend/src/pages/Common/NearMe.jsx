import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useProfile } from "../../context/ProfileContext";
import { useToken } from "../../context/TokenContext";
import QRCodeModal from "../Trust/Modal/QRCodeModal";
import FeedbackModal from "../Trust/Modal/FeedbackModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCircleDollarToSlot,
  faComment,
  faPhone,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { navigatetoAppointment } from "../../utils/navigationUtils";
import ContactForm from "./Components/ContactForm";
import Footer from "./Components/Footer";

const NearMe = () => {
  const [oldAgeHomes, setOldAgeHomes] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedHomeId, setSelectedHomeId] = useState(null);
  const { profile } = useProfile();
  console.log(profile);
  const { token } = useToken();
  console.log(token);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchOldAgeHomes = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/old-age-homes/all`
      );
      const data = await response.json();
      setOldAgeHomes(data);
    } catch (error) {
      console.error("Error fetching old age homes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOldAgeHomes();
  }, [token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleContactClick = (home) => {
    navigate(`/about/${home._id}`, {
      state: home, // Pass the entire home object
    });
  };
  // Add this function to handle feedback modal refresh
  const handleFeedbackSuccess = () => {
    // Refresh the old age homes data

    fetchOldAgeHomes();
  };
  const handleAppointmentClick = (homeId) => {
    navigatetoAppointment(navigate, homeId);
  };

  const filteredHomes = oldAgeHomes.filter((home) => {
    return (
      (!filters.country ||
        home.old_age_home_country
          .toLowerCase()
          .includes(filters.country.toLowerCase())) &&
      (!filters.state ||
        home.old_age_home_state
          .toLowerCase()
          .includes(filters.state.toLowerCase())) &&
      (!filters.city ||
        home.old_age_home_city
          .toLowerCase()
          .includes(filters.city.toLowerCase()))
    );
  });

  const handleDelete = async (homeId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/old-age-homes/delete/${homeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setOldAgeHomes((prev) => prev.filter((home) => home._id !== homeId));
        alert("Old age home deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting old age home:", error);
    }
  };
  const renderActionButtons = (home) => {
    if (!token) {
      return (
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login to Access Features
          </button>
        </div>
      );
    }
    return (
      <>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => handleContactClick(home)}
            className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
            title="Contact"
          >
            <FontAwesomeIcon icon={faPhone} />
          </button>
          {home.old_age_home_upi_id && (
            <button
              onClick={() => {
                setSelectedUpiId(home.old_age_home_upi_id);
                setShowQRModal(true);
              }}
              className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
              title="Donate"
            >
              <FontAwesomeIcon icon={faCircleDollarToSlot} />
            </button>
          )}
          {(profile?.role === "user" || profile?.role === "admin") && (
            <button
              onClick={() => {
                setSelectedHomeId(home._id);
                setShowFeedbackModal(true);
              }}
              className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
              title="Leave Feedback"
            >
              <FontAwesomeIcon icon={faComment} />
            </button>
          )}
          {profile?.role === "user" && (
            <button
              className="flex items-center justify-center w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition"
              title="Take Appointment"
              onClick={() => handleAppointmentClick(home._id)}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
            </button>
          )}
          {(profile?.role === "manager" &&
            profile._id === home.manager_id._id) ||
          profile?.role === "admin" ? (
            <button
              onClick={() => handleDelete(home._id)}
              className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
              title="Delete"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          ) : null}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      <Navbar />

      <div className="container mx-auto px-6 py-12">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10 tracking-wide">
          Old Age Homes Near Me
        </h1>

        {/* Filters */}
        {profile?.role === "manager" && (
          <div className="text-center mb-8">
            <button
              onClick={() => navigate("/create-old-age-home")}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
            >
              Add New Old Age Home
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <input
            type="text"
            name="country"
            placeholder="Filter by Country"
            value={filters.country}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            name="state"
            placeholder="Filter by State"
            value={filters.state}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            name="city"
            placeholder="Filter by City"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHomes.map((home) => (
              <div
                key={home._id}
                className="flex items-center bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
              >
                {/* Left Section: Trust Logo */}
                <div className="w-24 h-24 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/api/files/file/${
                      home.manager_id.trust_logo
                    }`}
                    alt="Trust Logo"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Middle Section: Home Info */}
                <div className="flex-1 px-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {home.old_age_home_name}
                  </h2>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {home.old_age_home_city}
                    </p>
                    <p>
                      <span className="font-medium">State:</span>{" "}
                      {home.old_age_home_state}
                    </p>
                    <p>
                      <span className="font-medium">Country:</span>{" "}
                      {home.old_age_home_country}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {home.old_age_home_address}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Rating:</span>{" "}
                      {home.avg_rating.toFixed(1)} ⭐ ({home.num_review.length}{" "}
                      reviews)
                    </p>
                  </div>
                </div>

                {/* Right Section: Actions */}
                {renderActionButtons(home)}
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showQRModal && selectedUpiId && (
          <QRCodeModal
            upiId={selectedUpiId}
            onClose={() => {
              setShowQRModal(false);
              setSelectedUpiId(null);
            }}
          />
        )}
        {showFeedbackModal && selectedHomeId && (
          <FeedbackModal
            oldAgeHomeId={selectedHomeId}
            onClose={() => {
              setShowFeedbackModal(false);
              setSelectedHomeId(null);
            }}
            onSubmitSuccess={handleFeedbackSuccess}
          />
        )}
      </div>

      <ContactForm />
      <Footer />
    </div>
  );
};

export default NearMe;
