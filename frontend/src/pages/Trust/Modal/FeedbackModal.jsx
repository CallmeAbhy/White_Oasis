// FeedbackModal.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useToken } from "../../../context/TokenContext";
import { useProfile } from "../../../context/ProfileContext";
import { useError } from "../../../context/ErrorContext";
import { useApiErrorHandler } from "../../../utils/apiErrorHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const FeedbackModal = ({ oldAgeHomeId, onClose, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { token } = useToken();
  const { profile } = useProfile();
  const { showError } = useError();
  const { handleApiError } = useApiErrorHandler();

  useEffect(() => {
    fetchReviews();
  }, [oldAgeHomeId]);

  const validateReview = (reviewText, rating) => {
    if (rating === 0) return "Please select a rating";
    if (rating <= 3 && (!reviewText || reviewText.trim().length < 10)) {
      return "For ratings of 3 stars or less, please provide detailed feedback (at least 10 characters)";
    }
    return null;
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/old-age-homes/getreviews/${oldAgeHomeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.num_review || []);
        setCurrentPage(1); // Reset to first page when fetching new reviews
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      handleApiError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateReview(review, rating);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/old-age-homes/rate/${oldAgeHomeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            review: review.trim(),
          }),
        }
      );

      if (response.ok) {
        await fetchReviews();
        onSubmitSuccess();
        setRating(0);
        setReview("");
        setShowReviews(true);
        setError("");
      } else {
        const data = await response.json();
        setError(data.message);
        showError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
      handleApiError(error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/old-age-homes/${oldAgeHomeId}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchReviews();
        setError("");
      } else {
        const data = await response.json();
        setError(data.message);
        showError(data.message);
      }
    } catch (error) {
      setError("Error deleting review");
      console.error(error);
      handleApiError(error);
    }
  };

  const canDeleteReview = (reviewUsername) => {
    return profile?.role === "admin" || profile?.username === reviewUsername;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-2xl ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2">
          <h3 className="text-xl font-semibold text-gray-800">
            {showReviews ? "Reviews" : "Submit Your Feedback"}
          </h3>
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="text-blue-500 hover:text-blue-600"
          >
            {showReviews ? "Write Review" : "View Reviews"}
          </button>
        </div>

        {showReviews ? (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center">No reviews yet</p>
            ) : (
              <>
                {currentReviews.map((review, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-800">
                            {review.username}
                          </span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2">{review.review}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(review.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      {canDeleteReview(review.username) && (
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-lg ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    } hover:scale-110 transform transition`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!rating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  oldAgeHomeId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
};

export default FeedbackModal;
