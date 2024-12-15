import PropTypes from "prop-types";
import FileUploadField from "../TypeWiseUpload/FileUploadField";
import InputField from "../TypeWiseUpload/InputField";
import LocationInput from "../TypeWiseUpload/LocationInput";

const ManagerForm = ({
  formData,
  handleChange,
  handleLocationChange,
  locationCodes,
  handleFileChange,
}) => {
  return (
    <>
      <InputField
        name="name_of_trust"
        placeholder="Name of Trust"
        value={formData.name_of_trust}
        onChange={handleChange}
      />
      <LocationInput
        type="country"
        name="head_office_country"
        value={formData.head_office_country}
        onChange={(e) => handleLocationChange(e, "manager")}
        codes={locationCodes.manager}
        placeholder="Head Office Country"
        required
      />
      <LocationInput
        type="state"
        name="head_office_state"
        value={formData.head_office_state}
        onChange={(e) => handleLocationChange(e, "manager")}
        codes={locationCodes.manager}
        placeholder="Head Office State"
        required
      />
      <LocationInput
        type="city"
        name="head_office_city"
        value={formData.head_office_city}
        onChange={(e) => handleLocationChange(e, "manager")}
        codes={locationCodes.manager}
        placeholder="Head Office City"
        required
      />
      <LocationInput
        type="address"
        name="head_office_address"
        value={formData.head_office_address}
        onChange={(e) => handleLocationChange(e, "manager")}
        placeholder="Head Office Address"
        required
      />
      <FileUploadField
        label="Trust Document"
        htmlFor="trust_document"
        tooltip="Must be in one of the following formats [Limit 5MB]: 1) Trust Deed 2) Certification of Trust 3) PAN Card of Trust"
        id="trust_document"
        name="trust_document"
        onChange={handleFileChange}
        accept=""
      />
      <FileUploadField
        label="Financial Statements"
        htmlFor="financial_statements"
        tooltip="Must be in one of the following formats [Limit 5MB]: 1) ITR Return 2) Annual Report"
        id="financial_statements"
        name="financial_statements"
        onChange={handleFileChange}
        accept=""
      />
      <FileUploadField
        label="Trust Domicile"
        htmlFor="trust_domicile"
        tooltip="Must be in one of the following formats [Limit 5MB]: 1) State Registration Document 2) Property Deeds"
        id="trust_domicile"
        name="trust_domicile"
        onChange={handleFileChange}
        accept=""
      />
      <FileUploadField
        label="Trust Logo"
        htmlFor="trust_logo"
        tooltip="Must be in one of the following formats [Limit 5MB]:  1) JPEG   2) JPG 3) PNG"
        id="trust_logo"
        name="trust_logo"
        onChange={handleFileChange}
        accept=".png, .jpg, .jpeg"
      />
    </>
  );
};

// Define PropTypes for the ManagerForm component
ManagerForm.propTypes = {
  formData: PropTypes.shape({
    name_of_trust: PropTypes.string.isRequired,
    head_office_country: PropTypes.string.isRequired,
    head_office_state: PropTypes.string.isRequired,
    head_office_city: PropTypes.string.isRequired,
    head_office_address: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleLocationChange: PropTypes.func.isRequired,
  locationCodes: PropTypes.shape({
    manager: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

export default ManagerForm;
