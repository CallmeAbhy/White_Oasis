// src/pages/Appointment/BookAppointment.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToken } from "../../context/TokenContext";
import Navbar from "../../components/Navbar";
import ContactForm from "../Common/Components/ContactForm";
import Footer from "../Common/Components/Footer";
import AdoptionAgreementModal from "../../components/AdoptionAgreementModal";
import { useProfile } from "../../context/ProfileContext";
import { useError } from "../../context/ErrorContext";
import { useApiErrorHandler } from "../../utils/apiErrorHandler";
const BookAppointment = () => {
  const { homeId } = useParams();
  const { token } = useToken();
  const navigate = useNavigate();
  const { showError } = useError();
  const { handleApiError } = useApiErrorHandler();
  const [appointmentData, setAppointmentData] = useState({
    appointment_type: "",
    reason: "",
    appointment_date: "",
    start_time: "",
    end_time: "",
  });
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementData, setAgreementData] = useState(null);
  const { profile } = useProfile();
  console.log("The Profile username is ", profile.username);
  const [availableSlots, setAvailableSlots] = useState([]);
  // Add date validation

  const validateAppointmentDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return "Please select a future date";
    }
    // Prevent booking more than 3 months in advance
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);
    if (selectedDate > threeMonthsLater) {
      return "Appointments can only be booked up to 3 months in advance";
    }
    return null;
  };

  // Add time slot validation
  const validateTimeSlot = (start, end) => {
    if (!start || !end) {
      return "Please select both start and end times";
    }
    // Convert to minutes for comparison
    const startParts = start.split(":");
    const endParts = end.split(":");
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
    // Ensure minimum appointment duration (e.g., 30 minutes)
    if (endMinutes - startMinutes < 30) {
      return "Appointment must be at least 30 minutes long";
    }
    return null;
  };

  // Fetch available slots when date changes
  useEffect(() => {
    if (appointmentData.appointment_date) {
      fetchAvailableSlots();
    }
  }, [appointmentData.appointment_date, homeId, token]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/appointments/available-slots/${homeId}/${
          appointmentData.appointment_date
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setAvailableSlots(data.availableSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate date
    const dateError = validateAppointmentDate(appointmentData.appointment_date);
    if (dateError) {
      showError(dateError);
      return;
    }
    // Validate time slot
    const timeError = validateTimeSlot(
      appointmentData.start_time,
      appointmentData.end_time
    );
    if (timeError) {
      showError(timeError);
      return;
    }
    // Validate reason
    if (!appointmentData.reason || appointmentData.reason.trim().length < 10) {
      showError(
        "Please provide a detailed reason for your appointment (at least 10 characters)"
      );
      return;
    }
    if (appointmentData.appointment_type === "Adoption" && !agreementData) {
      setShowAgreementModal(true);
      return;
    }
    await submitAppointment();
  };

  const submitAppointment = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/appointments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...appointmentData,
            old_age_home_id: homeId,
          }),
        }
      );

      if (response.ok) {
        alert("Appointment booked successfully!");
        navigate("/near-me");
      } else {
        handleApiError(response.statusMessage + " " + response.statusText);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      handleApiError(error?.message || "Appointment not booked successfully!");
    }
  };

  const handleAgreementSubmit = (data) => {
    setAgreementData(data);
    setShowAgreementModal(false);
    submitAppointment();
  };
  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 mt-6">Book Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Appointment Date</label>
            <input
              type="date"
              value={appointmentData.appointment_date}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  appointment_date: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {availableSlots.length > 0 && (
            <div>
              <label className="block mb-2">Select Start Time</label>
              <select
                value={appointmentData.start_time}
                onChange={(e) => {
                  setAppointmentData({
                    ...appointmentData,
                    start_time: e.target.value,
                    end_time: "", // Reset end time if start time changes
                  });
                }}
                className="w-full p-2 border rounded mb-4"
                required
              >
                <option value="">Select a start time</option>
                {availableSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Select End Time</label>
              <select
                value={appointmentData.end_time}
                onChange={(e) => {
                  setAppointmentData({
                    ...appointmentData,
                    end_time: e.target.value,
                  });
                }}
                className="w-full p-2 border rounded"
                required
                disabled={!appointmentData.start_time} // Disable end time selection until start time is selected
              >
                <option value="">Select an end time</option>
                {availableSlots
                  .filter((slot) => slot > appointmentData.start_time) // Only show slots after the selected start time
                  .map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
              </select>

              {appointmentData.start_time && appointmentData.end_time && (
                <p className="mt-2 text-sm text-green-600">
                  Appointment scheduled from {appointmentData.start_time} to{" "}
                  {appointmentData.end_time}.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block mb-2">Appointment Type</label>
            <select
              value={appointmentData.appointment_type}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  appointment_type: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select type</option>
              <option value="Visit">Visit</option>
              <option value="Enquiry">Enquiry</option>
              <option value="Adoption">Adoption</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Reason for Appointment</label>
            <textarea
              value={appointmentData.reason}
              onChange={(e) =>
                setAppointmentData({
                  ...appointmentData,
                  reason: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>
        {showAgreementModal && (
          <AdoptionAgreementModal
            isOpen={showAgreementModal}
            onClose={() => setShowAgreementModal(false)}
            onSubmit={handleAgreementSubmit}
            username={profile?.username || ""}
            appointmentDate={appointmentData.appointment_date}
            timeSlot={`${appointmentData.start_time} - ${appointmentData.end_time}`}
          />
        )}
      </div>
      <ContactForm />
      <Footer />
    </>
  );
};

export default BookAppointment;
