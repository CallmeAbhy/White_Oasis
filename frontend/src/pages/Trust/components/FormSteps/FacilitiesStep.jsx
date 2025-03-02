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
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Facilities Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Facilities
        </label>
        <div className="space-y-3">
          {formData.facilities.map((facility, index) => (
            <div
              key={index}
              className="flex items-center gap-3 flex-col sm:flex-row"
            >
              <input
                type="text"
                value={facility}
                onChange={(e) => handleFacilityChange(index, e.target.value)}
                placeholder={`Facility ${index + 1}`}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeFacilityField(index)}
                  className="w-full sm:w-auto px-4 py-2 text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addFacilityField}
            className="w-full sm:w-auto mt-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors duration-200"
          >
            + Add Another Facility
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Services
        </label>
        <div className="space-y-3">
          {formData.services.map((service, index) => (
            <div
              key={index}
              className="flex items-center gap-3 flex-col sm:flex-row"
            >
              <input
                type="text"
                value={service}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                placeholder={`Service ${index + 1}`}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeServiceField(index)}
                  className="w-full sm:w-auto px-4 py-2 text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addServiceField}
            className="w-full sm:w-auto mt-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors duration-200"
          >
            + Add Another Service
          </button>
        </div>
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
