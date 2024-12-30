import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCheck,
  faTimes,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../../components/Navbar";
import { useToken } from "../../../context/TokenContext";
import { useProfile } from "../../../context/ProfileContext";

const ManagerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { token } = useToken();
  const navigate = useNavigate();
  const { profile } = useProfile();

  // Authorization check
  useEffect(() => {
    if (!profile || profile.role !== "manager" || !token) {
      setMessage("Unauthorized Access");
      navigate("/login");
    }
  }, [profile, navigate, token]);

  // Fetch pending appointments
  useEffect(() => {
    const fetchPendingAppointments = async () => {
      if (profile && profile.role === "manager") {
        try {
          const response = await fetch(
            "http://localhost:7001/api/appointments/pending/Pending",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setAppointments(data.appointments);
        } catch (e) {
          console.error("Error Fetching Appointments", e);
          setMessage("Error loading appointments");
        }
      }
    };
    fetchPendingAppointments();
  }, [profile, token]);

  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(
        `http://localhost:7001/api/appointments/${appointmentId}/status`,
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
        setShowFeedbackModal(false);
        setFeedback("");
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setMessage("Failed to update appointment status");
    }
  };

  const openFeedbackModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowFeedbackModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Manager Dashboard
          </h2>
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            <span className="font-medium text-gray-600">
              Pending Appointments: {appointments.length}
            </span>
          </div>
        </div>

        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-105"
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
                  <span className="font-medium">Reason:</span>{" "}
                  {appointment.reason}
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleAppointmentStatus(appointment._id, "Approved")
                  }
                  className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => openFeedbackModal(appointment)}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon
                  icon={faComments}
                  className="text-blue-500 mr-2"
                />
                <h3 className="text-lg font-bold">Rejection Feedback</h3>
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                rows="4"
                placeholder="Enter reason for rejection..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleAppointmentStatus(selectedAppointment._id, "Rejected")
                  }
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
