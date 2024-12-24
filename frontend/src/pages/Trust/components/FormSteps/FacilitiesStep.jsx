import PropTypes from "prop-types";

export const FacilitiesStep = ({
  formData,
  handleFacilityChange,
  addFacilityField,
  removeFacilityField,
  handleServiceChange,
  addServiceField,
  removeServiceField,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Facilities
        </label>
        {formData.facilities.map((facility, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={facility}
              onChange={(e) => handleFacilityChange(index, e.target.value)}
              placeholder={`Facility ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeFacilityField(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addFacilityField}
          className="text-blue-500 hover:underline"
        >
          Add Another Facility
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Services
        </label>
        {formData.services.map((service, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={service}
              onChange={(e) => handleServiceChange(index, e.target.value)}
              placeholder={`Service ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeServiceField(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addServiceField}
          className="text-blue-500 hover:underline"
        >
          Add Another Service
        </button>
      </div>
    </div>
  );
};

FacilitiesStep.propTypes = {
  formData: PropTypes.shape({
    facilities: PropTypes.arrayOf(PropTypes.string).isRequired,
    services: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleFacilityChange: PropTypes.func.isRequired,
  addFacilityField: PropTypes.func.isRequired,
  removeFacilityField: PropTypes.func.isRequired,
  handleServiceChange: PropTypes.func.isRequired,
  addServiceField: PropTypes.func.isRequired,
  removeServiceField: PropTypes.func.isRequired,
};
