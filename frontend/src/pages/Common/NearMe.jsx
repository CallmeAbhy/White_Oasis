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
        "http://localhost:7001/api/old-age-homes/all"
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
    navigate(`/contact/${home._id}`, {
      state: {
        name: home.old_age_home_name,
        contact_numbers: home.contact_numbers,
        email: home.email,
        address: home.old_age_home_address,
      },
    });
  };
  // Add this function to handle feedback modal refresh
  const handleFeedbackSuccess = () => {
    // Refresh the old age homes data

    fetchOldAgeHomes();
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
        `http://localhost:7001/api/old-age-homes/delete/${homeId}`,
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

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-[#002D74] mb-8 tracking-wide">
          Old Age Homes Near Me
        </h1>

        {/* Filters */}
        {profile?.role === "manager" && (
          <div className="text-center mb-6">
            <button
              onClick={() => navigate("/create-old-age-home")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              Add New Old Age Home
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 z-10 relative">
          <div className="relative">
            <input
              type="text"
              name="country"
              placeholder="Filter by Country"
              value={filters.country}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="state"
              placeholder="Filter by State"
              value={filters.state}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="city"
              placeholder="Filter by City"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          // Old Age Homes Grid
          <div className="grid grid-cols-1 gap-6">
            {filteredHomes.map((home) => (
              <div
                key={home._id}
                className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Left Section: Details */}
                <div className="flex-1 p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {home.old_age_home_name}
                  </h2>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <p>
                      <span className="font-medium text-gray-800">City:</span>{" "}
                      {home.old_age_home_city}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">State:</span>{" "}
                      {home.old_age_home_state}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Country:
                      </span>{" "}
                      {home.old_age_home_country}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Address:
                      </span>{" "}
                      {home.old_age_home_address}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Rating:</span>{" "}
                    {home.avg_rating.toFixed(1)} ⭐ ({home.num_review.length}{" "}
                    reviews)
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex flex-wrap sm:flex-col items-center justify-around sm:justify-start p-4 space-x-4 sm:space-x-0 sm:space-y-4 border-t sm:border-t-0 sm:border-l border-gray-200">
                  <button
                    onClick={() => handleContactClick(home)}
                    className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                    title="Contact Us"
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
                      // onClick={() => handleTakeAppointment(home._id)}
                      className="flex items-center justify-center w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition"
                      title="Take Appointment"
                    >
                      <FontAwesomeIcon icon={faCalendarCheck} />
                    </button>
                  )}

                  {(profile?.role === "manager" &&
                    profile._id === home.manager_id) ||
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
              </div>
            ))}
          </div>
        )}
      </div>

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
  );
};

export default NearMe;
