import PropTypes from "prop-types";
import FileUploadField from "../TypeWiseUpload/FileUploadField";
import LocationInput from "../TypeWiseUpload/LocationInput";

const UserForm = ({
  formData,
  handleLocationChange,
  locationCodes,
  handleFileChange,
  handleChange,
}) => {
  return (
    <>
      <LocationInput
        type="country"
        name="country"
        value={formData.country}
        onChange={(e) => handleLocationChange(e, "user")}
        codes={locationCodes.user}
        placeholder="Country"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
      />
      <LocationInput
        type="state"
        name="state"
        value={formData.state}
        onChange={(e) => handleLocationChange(e, "user")}
        codes={locationCodes.user}
        placeholder="State"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
      />
      <LocationInput
        type="city"
        name="city"
        value={formData.city}
        onChange={(e) => handleLocationChange(e, "user")}
        codes={locationCodes.user}
        placeholder="City"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
      />
      <LocationInput
        type="address"
        name="address"
        value={formData.address}
        onChange={(e) => handleLocationChange(e, "user")}
        placeholder="Address"
        divclassname="relative w-full"
        inputclassname="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        loadingclassname="absolute right-10 top-1/2 transform -translate-y-1/2"
        loaderclassname="loader w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"
        buttonclassname="absolute right-2 top-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
        ulclassname="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md"
      />
      <FileUploadField
        label="Government ID Card"
        htmlFor="governmentIdCard"
        tooltip="Upload Any of Following: 1) Aadhar Card 2) Pan Card 3) Election Card"
        id="governmentIdCard"
        name="governmentIdCard"
        accept=""
        onChange={handleFileChange}
      />
      <FileUploadField
        label="User Photo"
        htmlFor="userPhoto"
        tooltip="Must be in one of the following formats [Limit 5MB]: 1) JPEG  2) JPG   3) PNG"
        id="userPhoto"
        name="userPhoto"
        accept=".png, .jpg, .jpeg"
        onChange={handleFileChange}
      />
      <div className="flex flex-col mt-4">
        <label className="mb-1 relative group" htmlFor="dateOfBirth">
          Date of Birth
        </label>
        <input
          type="date"
          id="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className="p-2 mt-1 rounded-xl border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  );
};
UserForm.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.string.isRequired,
  }).isRequired,
  handleLocationChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  locationCodes: PropTypes.shape({
    user: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
export default UserForm;
