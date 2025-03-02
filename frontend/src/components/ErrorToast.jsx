// /frontend/src/components/ErrorToast.jsx
import { useEffect } from "react";
import { useError } from "../context/ErrorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

const ErrorToast = () => {
  const { error, isVisible, hideError } = useError();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) hideError();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [hideError]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg flex items-start">
        <div className="flex-shrink-0 mr-3">
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className="text-red-500 text-xl"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-red-800 font-medium">Error</h3>
          <div className="text-red-700 mt-1">{error}</div>
        </div>
        <button
          onClick={hideError}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
