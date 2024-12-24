import PropTypes from "prop-types";

export const ContactStep = ({
  formData,
  handlePhoneNumberChange,
  removePhoneNumberField,
  addPhoneNumberField,
  handleInputChange,
  handleSocialLinksChange,
  addSocialLinkField,
  removeSocialLinkField,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-600">
          Add Contact Numbers (Up to 3)
        </h3>
        {formData.contact_numbers.map((number, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="tel"
              id={`contact_number_${index}`}
              name={`contact_number_${index}`}
              value={number}
              onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
              placeholder={`Contact Number ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required={index === 0}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removePhoneNumberField(index)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {formData.contact_numbers.length < 3 && (
          <button
            type="button"
            onClick={addPhoneNumberField}
            className="text-blue-500 hover:underline"
          >
            Add Another Contact Number
          </button>
        )}
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter Email Address"
          required
        />
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media Links</h3>
        {Object.entries(formData.social_links).map(([platform, url], index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              name={`social_platform_${index}`}
              value={platform}
              onChange={(e) =>
                handleSocialLinksChange(index, "platform", e.target.value)
              }
              placeholder="Platform (e.g., Facebook)"
              className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="url"
              name={`social_link_${index}`}
              value={url}
              onChange={(e) =>
                handleSocialLinksChange(index, "url", e.target.value)
              }
              placeholder="URL"
              className="w-2/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeSocialLinkField(platform)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {Object.keys(formData.social_links).length < 5 && (
          <button
            type="button"
            onClick={addSocialLinkField}
            className="text-blue-500 hover:underline"
          >
            Add Another Social Link
          </button>
        )}
      </div>
    </div>
  );
};

ContactStep.propTypes = {
  formData: PropTypes.shape({
    contact_numbers: PropTypes.arrayOf(PropTypes.string).isRequired,
    email: PropTypes.string.isRequired,
    social_links: PropTypes.object,
  }).isRequired,
  handlePhoneNumberChange: PropTypes.func.isRequired,
  removePhoneNumberField: PropTypes.func.isRequired,
  addPhoneNumberField: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleSocialLinksChange: PropTypes.func.isRequired,
  addSocialLinkField: PropTypes.func.isRequired,
  removeSocialLinkField: PropTypes.func.isRequired,
};
