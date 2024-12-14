import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PropTypes from "prop-types";
const CommonFields = ({
  formData,
  handleChange,
  usernameClass,
  passwordClass,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <input
        type="text"
        placeholder="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
        className={`p-2 ${usernameClass} rounded-xl border `}
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          className={`p-2 rounded-xl border ${passwordClass}`}
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className="text-gray-500"
          />
        </button>
      </div>
    </>
  );
};
CommonFields.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  passwordClass: PropTypes.string,
  usernameClass: PropTypes.string,
};

export default CommonFields;
