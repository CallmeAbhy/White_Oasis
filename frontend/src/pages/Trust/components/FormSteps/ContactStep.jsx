import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faWhatsapp,
  faXTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { validateEmail, validatePhoneNumber } from "../../utils/formValidation";

const SOCIAL_PLATFORMS = {
  facebook: {
    icon: faSquareFacebook,
    name: "Facebook",
    placeholder: "Enter Facebook URL",
  },
  whatsapp_group: {
    icon: faWhatsapp,
    name: "WhatsApp",
    placeholder: "Enter WhatsApp URL",
  },
  twitter: {
    icon: faXTwitter,
    name: "Twitter",
    placeholder: "Enter Twitter URL",
  },
  instagram: {
    icon: faInstagram,
    name: "Instagram",
    placeholder: "Enter Instagram URL",
  },
  website: {
    icon: faLink,
    name: "Website",
    placeholder: "Enter Website URL",
  },
  youtube: {
    icon: faYoutube,
    name: "YouTube",
    placeholder: "Enter YouTube URL",
  },
};

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
  const isValidPhone = (number) => validatePhoneNumber(number);
  const isValidEmail = (email) => validateEmail(email);

  return (
    <div className="space-y-6">
      {/* Contact Numbers Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Contact Numbers (Up to 3)
        </h3>
        <div className="space-y-3">
          {formData.contact_numbers.map((number, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="tel"
                  id={`contact_number_${index}`}
                  name={`contact_number_${index}`}
                  value={number}
                  onChange={(e) =>
                    handlePhoneNumberChange(index, e.target.value)
                  }
                  placeholder={`Contact Number ${index + 1}`}
                  className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    number && !isValidPhone(number)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  required={index === 0}
                />
                {number && !isValidPhone(number) && (
                  <p className="text-red-500 text-sm mt-1">
                    Please enter a valid phone number
                  </p>
                )}
              </div>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removePhoneNumberField(index)}
                  className="text-red-500 hover:text-red-700 font-medium"
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
              className="text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              + Add Another Contact Number
            </button>
          )}
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              formData.email && !isValidEmail(formData.email)
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter Email Address"
            required
          />
          {formData.email && !isValidEmail(formData.email) && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid email address
            </p>
          )}
        </div>
      </div>

      {/* Social Media Links Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Social Media Links
        </h3>
        <div className="space-y-4">
          {Object.entries(formData.social_links).map(
            ([platform, url], index) => (
              <div key={index} className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={SOCIAL_PLATFORMS[platform]?.icon || faLink}
                  className="text-gray-600 text-lg"
                />
                <input
                  type="text"
                  name={`social_platform_${index}`}
                  value={platform}
                  onChange={(e) =>
                    handleSocialLinksChange(index, "platform", e.target.value)
                  }
                  placeholder="Platform (e.g., Facebook)"
                  className="w-1/3 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="url"
                  name={`social_link_${index}`}
                  value={url}
                  onChange={(e) =>
                    handleSocialLinksChange(index, "url", e.target.value)
                  }
                  placeholder={
                    SOCIAL_PLATFORMS[platform]?.placeholder || "Enter URL"
                  }
                  className="flex-1 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeSocialLinkField(platform)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            )
          )}
          {Object.keys(formData.social_links).length < 5 && (
            <button
              type="button"
              onClick={addSocialLinkField}
              className="text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              + Add Another Social Link
            </button>
          )}
        </div>
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
