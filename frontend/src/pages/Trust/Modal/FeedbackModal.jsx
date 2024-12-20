// FeedbackModal.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useToken } from "../../../context/TokenContext";
import { useProfile } from "../../../context/ProfileContext";

const FeedbackModal = ({ oldAgeHomeId, onClose, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const { token } = useToken();
  const { profile } = useProfile();

  useEffect(() => {
    fetchReviews();
  }, [oldAgeHomeId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:7001/api/old-age-homes/getreviews/${oldAgeHomeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data.num_review || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Please select a rating");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:7001/api/old-age-homes/rate/${oldAgeHomeId}`,
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
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:7001/api/old-age-homes/reviews/${oldAgeHomeId}/${reviewId}`,
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
      }
    } catch (error) {
      setError("Error deleting review");
      console.error(error);
    }
  };

  const canDeleteReview = (reviewUsername) => {
    return profile?.role === "admin" || profile?.username === reviewUsername;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
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
          // Reviews List
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center">No reviews yet</p>
            ) : (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{review.username}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{review.review}</p>
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
              ))
            )}
          </div>
        ) : (
          // Review Form
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
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
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows="4"
                placeholder="Share your experience..."
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!rating}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
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