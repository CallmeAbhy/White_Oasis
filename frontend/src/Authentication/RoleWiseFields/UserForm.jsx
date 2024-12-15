import PropTypes from "prop-types";
import FileUploadField from "../TypeWiseUpload/FileUploadField";
import LocationInput from "../TypeWiseUpload/LocationInput";

const UserForm = ({
  formData,
  handleLocationChange,
  locationCodes,
  handleFileChange,
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
      />
      <LocationInput
        type="state"
        name="state"
        value={formData.state}
        onChange={(e) => handleLocationChange(e, "user")}
        codes={locationCodes.user}
        placeholder="State"
      />
      <LocationInput
        type="city"
        name="city"
        value={formData.city}
        onChange={(e) => handleLocationChange(e, "user")}
        codes={locationCodes.user}
        placeholder="City"
      />
      <LocationInput
        type="address"
        name="address"
        value={formData.address}
        onChange={(e) => handleLocationChange(e, "user")}
        placeholder="Address"
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
    </>
  );
};
UserForm.propTypes = {
  formData: PropTypes.shape({
    country: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  handleLocationChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  locationCodes: PropTypes.shape({
    user: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
export default UserForm;
