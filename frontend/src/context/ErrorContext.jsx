import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const showError = (message, timeout = 5000) => {
    setError(message);
    setIsVisible(true);

    if (timeout) {
      setTimeout(() => {
        setIsVisible(false);
      }, timeout);
    }
  };

  const hideError = () => {
    setIsVisible(false);
  };

  return (
    <ErrorContext.Provider value={{ error, isVisible, showError, hideError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
ErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
