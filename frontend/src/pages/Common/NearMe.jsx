import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useProfile } from "../../context/ProfileContext";
import { useToken } from "../../context/TokenContext";
import { QRCodeSVG } from "qrcode.react";
import PropTypes from "prop-types";
const NearMe = () => {
  const [oldAgeHomes, setOldAgeHomes] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedUpiId, setSelectedUpiId] = useState(null);
  const { profile } = useProfile();
  console.log(profile);
  const { token } = useToken();
  console.log(token);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
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
    fetchOldAgeHomes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  const QRCodeModal = ({ upiId, onClose }) => {
    const upiLink = `upi://pay?pa=${upiId}`;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Scan to Pay</h3>

            <QRCodeSVG value={upiLink} size={256} level="H" />

            <p className="mt-4 text-sm text-gray-600">UPI ID: {upiId}</p>

            <button
              onClick={onClose}
              className="mt-4 bg-[#002D74] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  QRCodeModal.propTypes = {
    upiId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-[#002D74] mb-8">
          Old Age Homes Near Me
        </h1>

        {/* Filters */}
        {profile?.role === "manager" && (
          <div className="text-center mb-6">
            <button
              onClick={() => navigate("/create-old-age-home")} // Redirect to /create
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Post
            </button>
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="country"
            placeholder="Filter by Country"
            value={filters.country}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="state"
            placeholder="Filter by State"
            value={filters.state}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="city"
            placeholder="Filter by City"
            value={filters.city}
            onChange={handleFilterChange}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          // Old Age Homes Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHomes.map((home) => (
              <div
                key={home._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {home.old_age_home_name}
                </h2>
                <div className="space-y-2 text-gray-600 text-sm">
                  <p>
                    <span className="font-medium text-gray-800">City:</span>{" "}
                    {home.old_age_home_city}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">State:</span>{" "}
                    {home.old_age_home_state}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Country:</span>{" "}
                    {home.old_age_home_country}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Address:</span>{" "}
                    {home.old_age_home_address}
                  </p>
                  {home.old_age_home_upi_id && (
                    <button
                      onClick={() => {
                        setSelectedUpiId(home.old_age_home_upi_id);
                        setShowQRModal(true);
                      }}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 mr-2"
                    >
                      Donate
                    </button>
                  )}

                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-gray-800">Rating:</span>
                    <span>{home.avg_rating.toFixed(1)} ⭐</span>
                    <span>({home.num_rating} reviews)</span>
                  </div>
                </div>

                {profile?.role === "manager" &&
                  profile._id === home.manager_id && (
                    <button
                      onClick={() => handleDelete(home._id)}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showQRModal && selectedUpiId && (
        <QRCodeModal
          upiId={selectedUpiId}
          onClose={() => {
            setShowQRModal(false);
            setSelectedUpiId(null);
          }}
        />
      )}
    </div>
  );
};

export default NearMe;
