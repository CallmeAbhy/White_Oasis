import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { navigateToDashboard } from "../utils/navigationUtils";
import { useToken } from "../context/TokenContext";

const UserDetail = () => {
  const navigate = useNavigate();
  const user = location.state?.user;
  const { token } = useToken(); // Passed from the "View" button click
  const [feedback, setFeedback] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false); // Toggle for feedback
  const [error, setError] = useState("");

  const handleApprove = async () => {
    try {
      const response = await fetch(
        `http://localhost:7001/api/admin/approve-manager/${user._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback: "You are now a member" }),
        }
      );
      console.log("The id is ", user._id);
      if (response.ok) {
        alert("User Approved Successfully!");
        // navigate("/dashboard", { state: { profile } });
        navigateToDashboard(navigate);
      } else {
        throw new Error("Approval failed!");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to approve the user.");
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      setError("Feedback is required to reject the application.");
      return;
    }
    try {
      const userId = user._id; // Use correct user ID format
      const response = await fetch(
        `http://localhost:7001/api/admin/reject-manager/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure Content-Type is JSON
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback }), // Stringify the feedback object
        }
      );
      if (response.ok) {
        alert("User Rejected Successfully!");
        // navigate("/dashboard", { state: { profile } });
        navigateToDashboard(navigate);
      } else {
        const errorData = await response.json();
        console.error("Rejection failed:", errorData);
        setError(errorData.message || "Rejection failed!");
      }
    } catch (e) {
      console.error("Error while rejecting:", e);
      setError("Failed to reject the user.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          User Details
        </h2>

        <div className="bg-white shadow-md rounded-lg p-6">
          {/* Form-Like Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trust Name:
              </label>
              <p className="text-gray-800">{user.name_of_trust}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <p className="text-gray-800">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone:
              </label>
              <p className="text-gray-800">{user.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address:
              </label>
              <p className="text-gray-800">{user.head_office_address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City:
              </label>
              <p className="text-gray-800">{user.head_office_city}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State:
              </label>
              <p className="text-gray-800">{user.head_office_state}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country:
              </label>
              <p className="text-gray-800">{user.head_office_country}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trust Document:
              </label>
              <a
                href={`http://localhost:7001/api/files/file/${user.trust_document}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Document
              </a>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Financial Statements:
              </label>
              <a
                href={`http://localhost:7001/api/files/file/${user.financial_statements}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Financials
              </a>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Trust Domicile:
              </label>
              <a
                href={`http://localhost:7001/api/files/file/${user.trust_domicile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Domicile
              </a>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status:
              </label>
              <p className="text-gray-800 capitalize">{user.status}</p>
            </div>
          </div>

          {/* Approve and Reject Buttons */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => {
                setError(""); // Clear error
                setFeedback(""); // Reset feedback
                setShowFeedbackInput(true); // Show feedback input
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Reject
            </button>
          </div>

          {/* Feedback Input (Only shown when Reject is clicked) */}
          {showFeedbackInput && (
            <div className="mt-4">
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700"
              >
                Rejection Feedback:
              </label>
              <textarea
                id="feedback"
                rows="4"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                onClick={handleReject}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Submit Feedback
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
