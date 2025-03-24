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
  faChevronLeft,
  faChevronRight,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedHomeId, setSelectedHomeId] = useState(null);
  const { profile } = useProfile();
  const { token } = useToken();
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
    setCurrentPage(1);
  };

  const handleContactClick = (home) => {
    navigate(`/about/${home._id}`, { state: home });
  };

  const handleFeedbackSuccess = () => {
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

  const totalPages = Math.ceil(filteredHomes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHomes = filteredHomes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    if (!token) return null; // No buttons shown if not logged in

    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleContactClick(home)}
          className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
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
            className="w-10 h-10 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition"
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
            className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition"
            title="Feedback"
          >
            <FontAwesomeIcon icon={faComment} />
          </button>
        )}
        {profile?.role === "user" && (
          <button
            onClick={() => handleAppointmentClick(home._id)}
            className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition"
            title="Appointment"
          >
            <FontAwesomeIcon icon={faCalendarCheck} />
          </button>
        )}
        {(profile?.role === "manager" && profile._id === home.manager_id._id) ||
        profile?.role === "admin" ? (
          <button
            onClick={() => handleDelete(home._id)}
            className="w-10 h-10 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
            title="Delete"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mt-6 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 ">
          Old Age Homes Near Me
        </h1>

        {/* Hide manager features if not logged in */}
        {token && profile?.role === "manager" && (
          <div className="text-center mb-8">
            <button
              onClick={() => navigate("/create-old-age-home")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add New Home
            </button>
          </div>
        )}

        {/* Show filters only if logged in */}
        {token && (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {["country", "state", "city"].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={`Filter by ${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }`}
                value={filters[field]}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : !token ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Please Login
            </h2>
            <p className="text-gray-600 mb-4">
              You need to login to access old age home features and listings.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Login to Access
            </button>
          </div>
        ) : filteredHomes.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600">
              Adjust your filters to find old age homes.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {currentHomes.map((home) => (
                <div
                  key={home._id}
                  className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 hover:shadow-lg transition"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                    <img
                      src={`${import.meta.env.VITE_API_URL}/api/files/file/${
                        home.manager_id.trust_logo
                      }`}
                      alt="Trust Logo"
                      className="w-full h-full object-cover rounded-full border border-gray-200"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {home.old_age_home_name}
                    </h2>
                    <div className="text-gray-600 mt-2 space-y-1">
                      <p>
                        {home.old_age_home_city}, {home.old_age_home_state}
                      </p>
                      <p>{home.old_age_home_country}</p>
                      <p>{home.old_age_home_address}</p>
                      <p className="text-yellow-600">
                        {home.avg_rating.toFixed(1)} ⭐ (
                        {home.num_review.length} reviews)
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {renderActionButtons(home)}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </>
        )}

        {token && showQRModal && selectedUpiId && (
          <QRCodeModal
            upiId={selectedUpiId}
            onClose={() => {
              setShowQRModal(false);
              setSelectedUpiId(null);
            }}
          />
        )}
        {token && showFeedbackModal && selectedHomeId && (
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
