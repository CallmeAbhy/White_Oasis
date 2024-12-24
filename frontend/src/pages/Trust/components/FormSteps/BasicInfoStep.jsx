// components/FormSteps/BasicInfoStep.jsx

import PropTypes from "prop-types";

export const BasicInfoStep = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div>
        <label
          htmlFor="old_age_home_name"
          className="block text-sm font-medium text-gray-600"
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
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>
      {/* UPI ID Input */}
      <div>
        <label
          htmlFor="old_age_home_upi_id"
          className="block text-sm font-medium text-gray-600"
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
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>
      {/* Appointment Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_appointment_enabled"
          name="is_appointment_enabled"
          checked={formData.is_appointment_enabled}
          onChange={handleInputChange}
          className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="is_appointment_enabled" className="text-gray-600">
          Enable Appointments
        </label>
      </div>
    </div>
  );
};
BasicInfoStep.propTypes = {
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
// Similar components for other steps:
// - LocationStep.jsx
// - TimingsStep.jsx
// - ContactStep.jsx
// - FacilitiesStep.jsx
// - ServicesStep.jsx
