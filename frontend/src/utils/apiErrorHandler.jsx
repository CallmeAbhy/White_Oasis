// /frontend/src/utils/apiErrorHandler.js
import { useError } from "../context/ErrorContext";

export const useApiErrorHandler = () => {
  const { showError } = useError();

  const handleApiError = (error) => {
    console.error("API Error:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage =
        error.response.data.message || "Server error. Please try again later.";
      showError(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      showError("Network error. Please check your connection and try again.");
    } else {
      // Something happened in setting up the request that triggered an Error
      showError("An unexpected error occurred. Please try again.");
    }
  };

  return { handleApiError };
};
