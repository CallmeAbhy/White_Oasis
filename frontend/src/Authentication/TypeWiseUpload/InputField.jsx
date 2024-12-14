// src/components/common/Input.jsx
import PropTypes from "prop-types";

export const InputField = ({ name, placeholder, value, onChange }) => (
  <input
    type="text"
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required
    className="p-2 mt-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#002D74]"
  />
);

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
