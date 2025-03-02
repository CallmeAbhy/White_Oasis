// src/pages/User/BookAppointment.jsx
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [oldAgeHome, setOldAgeHome] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch old age home details when component loads
  useEffect(() => {
    const fetchOldAgeHomeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/old-age-homes/homes/${homeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch old age home details");
        }

        const data = await response.json();
        setOldAgeHome(data);
      } catch (error) {
        console.error("Error fetching old age home details:", error);
        showError("Failed to load old age home information");
      } finally {
        setLoading(false);
      }
    };

    fetchOldAgeHomeDetails();
  }, [homeId, token, showError]);

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

    // Check if the selected day is a working day
    if (oldAgeHome && oldAgeHome.working_days) {
      const dayIndex = selectedDate.getDay();
      const daysOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const selectedDayName = daysOfWeek[dayIndex];

      if (!oldAgeHome.working_days.includes(selectedDayName)) {
        return `The old age home is closed on ${selectedDayName}s. Please select a working day.`;
      }
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
      showError("Failed to fetch available time slots");
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
        const errorData = await response.json();
        handleApiError(errorData.message || "Failed to book appointment");
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

  // Function to get min date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Function to get max date (3 months from today)
  const getMaxDate = () => {
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    return threeMonthsLater.toISOString().split("T")[0];
  };

  // Function to check if a date is a working day
  const isWorkingDay = (dateString) => {
    if (!oldAgeHome || !oldAgeHome.working_days) return true;

    const date = new Date(dateString);
    const dayIndex = date.getDay();
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = daysOfWeek[dayIndex];

    return oldAgeHome.working_days.includes(dayName);
  };

  // Function to handle date input change with validation
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (!isWorkingDay(selectedDate)) {
      const date = new Date(selectedDate);
      const dayIndex = date.getDay();
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = daysOfWeek[dayIndex];

      showError(
        `The old age home is closed on ${dayName}s. Please select a working day.`
      );
      return;
    }

    setAppointmentData({
      ...appointmentData,
      appointment_date: selectedDate,
    });
  };

  // Function to format working days for display
  const formatWorkingDays = (days) => {
    if (!days || !days.length) return "";

    return days
      .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
      .join(", ");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-5">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Book an Appointment
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={appointmentData.appointment_date}
                    onChange={handleDateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                    min={getMinDate()}
                    max={getMaxDate()}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                  {oldAgeHome && (
                    <p className="text-sm text-gray-600">
                      Available: {formatWorkingDays(oldAgeHome.working_days)}
                    </p>
                  )}
                </div>

                {availableSlots.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <select
                        value={appointmentData.start_time}
                        onChange={(e) => {
                          setAppointmentData({
                            ...appointmentData,
                            start_time: e.target.value,
                            end_time: "",
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        required
                      >
                        <option value="">Select start time</option>
                        {availableSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <select
                        value={appointmentData.end_time}
                        onChange={(e) => {
                          setAppointmentData({
                            ...appointmentData,
                            end_time: e.target.value,
                          });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 disabled:bg-gray-100"
                        required
                        disabled={!appointmentData.start_time}
                      >
                        <option value="">Select end time</option>
                        {availableSlots
                          .filter((slot) => slot > appointmentData.start_time)
                          .map((slot, index) => (
                            <option key={index} value={slot}>
                              {slot}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}

                {appointmentData.start_time && appointmentData.end_time && (
                  <p className="text-sm text-indigo-600 bg-indigo-50 p-2 rounded-md">
                    Scheduled: {appointmentData.start_time} -{" "}
                    {appointmentData.end_time}
                  </p>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Appointment Type
                  </label>
                  <select
                    value={appointmentData.appointment_type}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        appointment_type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                  >
                    <option value="">Select appointment type</option>
                    <option value="Visit">Visit</option>
                    <option value="Enquiry">Enquiry</option>
                    <option value="Adoption">Adoption</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Reason for Appointment
                  </label>
                  <textarea
                    value={appointmentData.reason}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        reason: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
                    required
                    rows="4"
                    placeholder="Please provide a detailed reason (min. 10 characters)"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium"
                >
                  Book Appointment
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

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
      <ContactForm />
      <Footer />
    </>
  );
};

export default BookAppointment;
