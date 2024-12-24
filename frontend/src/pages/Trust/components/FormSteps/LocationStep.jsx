import PropTypes from "prop-types";
import LocationInput from "../../../../Authentication/TypeWiseUpload/LocationInput";
export const LocationStep = ({
  formData,
  handleLocationChange,
  locationCodes,
}) => {
  return (
    <div className="space-y-4">
      <LocationInput
        type="country"
        name="old_age_home_country"
        value={formData.old_age_home_country}
        onChange={handleLocationChange}
        placeholder="Select Country"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
        required
      />
      <LocationInput
        type="state"
        name="old_age_home_state"
        value={formData.old_age_home_state}
        onChange={handleLocationChange}
        codes={{ countryCode: locationCodes.countryCode }}
        placeholder="Select State"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
        required
      />
      <LocationInput
        type="city"
        name="old_age_home_city"
        value={formData.old_age_home_city}
        onChange={handleLocationChange}
        codes={{
          countryCode: locationCodes.countryCode,
          stateCode: locationCodes.stateCode,
        }}
        placeholder="Select City"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
        required
      />
      <LocationInput
        type="address"
        name="old_age_home_address"
        value={formData.old_age_home_address}
        onChange={handleLocationChange}
        placeholder="Enter Address"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
        required
      />
    </div>
  );
};
LocationStep.propTypes = {
  formData: PropTypes.object.isRequired,
  handleLocationChange: PropTypes.func.isRequired,
  locationCodes: PropTypes.object.isRequired,
};
