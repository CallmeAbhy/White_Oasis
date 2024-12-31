import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";
import { useToken } from "../../context/TokenContext";
import { useProfile } from "../../context/ProfileContext";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [homes, setHomes] = useState({}); // Add this with other state declarations
  const { token } = useToken();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const handleInfoClick = (homeId) => {
    const homeData = homes[homeId];
    const { _id } = homeData;
    if (homeData) {
      navigate(`/about/${_id}`, { state: homeData });
    }
  };
  // Authorization check
  useEffect(() => {
    if (!profile || profile.role !== "user" || !token) {
      setMessage("Unauthorized Access");
      navigate("/login");
    }
  }, [profile, navigate, token]);

  // Fetch appointments based on status
  useEffect(() => {
    const fetchAppointments = async () => {
      if (profile && profile.role === "user") {
        try {
          const response = await fetch(
            `http://localhost:7001/api/appointments/user/${activeTab}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setAppointments(data.appointments);

          // Fetch home information for each appointment
          const homeData = {};
          for (const appointment of data.appointments) {
            const homeResponse = await fetch(
              `http://localhost:7001/api/old-age-homes/homes/${appointment.old_age_home_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const home = await homeResponse.json();
            homeData[appointment.old_age_home_id] = home;
          }
          setHomes(homeData);
        } catch (e) {
          console.error("Error Fetching Appointments", e);
          setMessage("Error loading appointments");
        }
      }
    };
    fetchAppointments();
  }, [profile, token, activeTab]);

  const tabs = ["Pending", "Approved", "Rejected"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            My Appointments
          </h2>
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            <span className="font-medium text-gray-600">
              Total Appointments: {appointments.length}
            </span>
          </div>
        </div>

        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="text-blue-500 mr-2"
                />
                <h3 className="text-lg font-bold text-gray-800">
                  Appointment Details
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Time:</span>{" "}
                  {appointment.start_time} - {appointment.end_time}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span>{" "}
                  {appointment.appointment_type}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`${
                      appointment.status === "Approved"
                        ? "text-green-600"
                        : appointment.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    } font-medium`}
                  >
                    {appointment.status}
                  </span>
                </p>
                {appointment.feedback && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Feedback:</span>{" "}
                    {appointment.feedback}
                  </p>
                )}
              </div>
              {/* Add the Info button */}

              <button
                onClick={() => handleInfoClick(appointment.old_age_home_id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={!homes[appointment.old_age_home_id]}
              >
                View Home Info
              </button>
            </div>
          ))}
        </div>

        {appointments.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No {activeTab.toLowerCase()} appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
