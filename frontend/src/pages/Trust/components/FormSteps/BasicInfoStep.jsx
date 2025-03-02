// components/FormSteps/BasicInfoStep.jsx

import PropTypes from "prop-types";

export const BasicInfoStep = ({ formData, handleInputChange, setFormData }) => {
  return (
    <div className="space-y-6">
      {/* Name Input */}
      <div>
        <label
          htmlFor="old_age_home_name"
          className="block text-sm font-semibold text-gray-700"
        >
          Old Age Home Name
        </label>
        <input
          type="text"
          id="old_age_home_name"
          name="old_age_home_name"
          value={formData.old_age_home_name}
          onChange={handleInputChange}
          placeholder="Enter old age home name"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* UPI ID Input */}
      <div>
        <label
          htmlFor="old_age_home_upi_id"
          className="block text-sm font-semibold text-gray-700"
        >
          UPI ID
        </label>
        <input
          type="text"
          id="old_age_home_upi_id"
          name="old_age_home_upi_id"
          value={formData.old_age_home_upi_id}
          onChange={handleInputChange}
          placeholder="Enter UPI ID"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Establishment Year of Old Age Home */}
      <div>
        <label
          htmlFor="yearOfEstablishment"
          className="block text-sm font-semibold text-gray-700"
        >
          Year of Establishment
        </label>
        <input
          type="number"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          name="yearOfEstablishment"
          placeholder="Year of Establishment"
          value={formData.yearOfEstablishment}
          onChange={handleInputChange}
          min="1800"
          max={new Date().getFullYear()}
        />
      </div>

      {/* Appointment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Appointment Duration (in Minutes)
          </label>
          <input
            type="number"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={
              formData.appointment_settings.duration === ""
                ? ""
                : formData.appointment_settings.duration
            }
            onChange={(e) => {
              const value = e.target.value === "" ? "" : Number(e.target.value);
              setFormData({
                ...formData,
                appointment_settings: {
                  ...formData.appointment_settings,
                  duration: value,
                },
              });
            }}
            min="30"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Max Appointment Per Day
          </label>
          <input
            type="number"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={formData.appointment_settings.max_appointments_per_day}
            onChange={(e) => {
              setFormData({
                ...formData,
                appointment_settings: {
                  ...formData.appointment_settings,
                  max_appointments_per_day: Number(e.target.value),
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

BasicInfoStep.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};
// Similar components for other steps:
// - LocationStep.jsx
// - TimingsStep.jsx
// - ContactStep.jsx
// - FacilitiesStep.jsx
// - ServicesStep.jsx
