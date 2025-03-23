import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCheck,
  faTimes,
  faComments,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar";
import { useToken } from "../../../context/TokenContext";
import { useProfile } from "../../../context/ProfileContext";
import ContactForm from "../../Common/Components/ContactForm";
import Footer from "../../Common/Components/Footer";
import PropTypes from "prop-types";
// Agreement Details Component
const AgreementDetails = ({ agreementData }) => {
  if (!agreementData || Object.keys(agreementData).length === 0) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-3">
        Agreement Details
      </h4>
      <div className="space-y-3">
        <div>
          <label className="font-medium text-gray-600">PAN:</label>
          <p className="text-gray-800">{agreementData.pan}</p>
        </div>
        <div>
          <label className="font-medium text-gray-600">Aadhaar:</label>
          <p className="text-gray-800">{agreementData.aadhaar}</p>
        </div>
        <div>
          <label className="font-medium text-gray-600">Date of Birth:</label>
          <p className="text-gray-800">
            {new Date(agreementData.dob).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [agreementData, setAgreementData] = useState(null);
  const { token } = useToken();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const tabs = ["Pending", "Approved", "Rejected"];

  // Authorization check
  useEffect(() => {
    if (!profile || profile.role !== "manager" || !token) {
      setMessage("Unauthorized Access");
      navigate("/login");
    }
  }, [profile, navigate, token]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (profile?.role === "manager") {
        try {
          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL
            }/api/appointments/pending/${activeTab}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          setAppointments(data.appointments || []);
        } catch (e) {
          console.error("Error Fetching Appointments", e);
          setMessage("Error loading appointments");
        }
      }
    };
    fetchAppointments();
  }, [profile, token, activeTab]);

  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            feedback: status === "Rejected" ? feedback : "Appointment approved",
          }),
        }
      );

      if (response.ok) {
        setAppointments(
          appointments.filter((apt) => apt._id !== appointmentId)
        );
        closeFeedbackModal();
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setMessage("Failed to update appointment status");
    }
  };

  const openUserInfoModal = (user, agreement) => {
    setShowFeedbackModal(false);
    setSelectedUser(user);
    setAgreementData(agreement);
    setShowUserInfoModal(true);
  };

  const closeUserInfoModal = () => {
    setSelectedUser(null);
    setShowUserInfoModal(false);
  };

  const openFeedbackModal = (appointment) => {
    setShowUserInfoModal(false);
    setSelectedAppointment(appointment);
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setSelectedAppointment(null);
    setShowFeedbackModal(false);
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Manager Dashboard
          </h2>
          <div className="mt-4 sm:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="font-medium text-gray-700">
              {activeTab} Appointments: {appointments.length}
            </span>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {appointments.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            No {activeTab.toLowerCase()} appointments found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon
                    icon={faCalendar}
                    className="text-indigo-600 mr-2"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Appointment Details
                  </h3>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(
                      appointment.appointment_date
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span>{" "}
                    {appointment.start_time} - {appointment.end_time}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {appointment.appointment_type}
                  </p>
                  <p>
                    <span className="font-medium">Reason:</span>{" "}
                    {appointment.reason}
                  </p>
                  {(activeTab === "Approved" || activeTab === "Rejected") && (
                    <p>
                      <span className="font-medium">Feedback:</span>{" "}
                      {appointment.feedback}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() =>
                      openUserInfoModal(
                        appointment.user_profile,
                        appointment.adoption_details
                      )
                    }
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    View User
                  </button>
                  {activeTab === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleAppointmentStatus(appointment._id, "Approved")
                        }
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => openFeedbackModal(appointment)}
                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Info Modal */}
        {showUserInfoModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  User Information
                </h3>
                <button
                  onClick={closeUserInfoModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/api/files/file/${
                      selectedUser.userPhoto
                    }`}
                    alt="User Photo"
                    className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500"
                  />
                  <div>
                    <label className="font-medium text-gray-600">
                      Username:
                    </label>
                    <p className="text-gray-800">{selectedUser.username}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Email:</label>
                    <p className="text-gray-800">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Phone:</label>
                    <p className="text-gray-800">{selectedUser.phone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-600">
                      Address:
                    </label>
                    <p className="text-gray-800">{selectedUser.address}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">City:</label>
                    <p className="text-gray-800">{selectedUser.city}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">State:</label>
                    <p className="text-gray-800">{selectedUser.state}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Country:
                    </label>
                    <p className="text-gray-800">{selectedUser.country}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">
                      Government ID:
                    </label>
                    <Link
                      to={`${import.meta.env.VITE_API_URL}/api/files/file/${
                        selectedUser.governmentIdCard
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 underline"
                    >
                      View Document
                    </Link>
                  </div>
                </div>
              </div>

              <AgreementDetails agreementData={agreementData} />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeUserInfoModal}
                  className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faComments}
                  className="text-indigo-600 mr-2"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  Rejection Feedback
                </h3>
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Enter reason for rejection..."
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeFeedbackModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleAppointmentStatus(selectedAppointment._id, "Rejected")
                  }
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ContactForm />
      <Footer />
    </div>
  );
};

AgreementDetails.propTypes = {
  agreementData: PropTypes.object,
};
export default ManagerDashboard;
