// frontend/src/pages/Common/NearMe.jsx
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useProfile } from "../../context/ProfileContext";
import { useToken } from "../../context/TokenContext";

const NearMe = () => {
  const [oldAgeHomes, setOldAgeHomes] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
  });
  const { profile } = useProfile();
  console.log(profile);
  const { token } = useToken();
  console.log(token);
  const [loading, setLoading] = useState(true);

  // Fetch all old age homes
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

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter old age homes based on selected filters
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

  // Handle delete old age home
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Old Age Homes Near Me</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="country"
            placeholder="Filter by Country"
            value={filters.country}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="Filter by State"
            value={filters.state}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="Filter by City"
            value={filters.city}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Old Age Homes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHomes.map((home) => (
            <div key={home._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">
                {home.old_age_home_name}
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>City: {home.old_age_home_city}</p>
                <p>State: {home.old_age_home_state}</p>
                <p>Country: {home.old_age_home_country}</p>
                <p>Address: {home.old_age_home_address}</p>

                <div className="flex items-center space-x-2">
                  <span>Rating: {home.avg_rating.toFixed(1)}</span>
                  <span>({home.num_rating} reviews)</span>
                </div>
              </div>
              {profile?.role === "manager" &&
                profile._id === home.manager_id && (
                  <button
                    onClick={() => handleDelete(home._id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearMe;
