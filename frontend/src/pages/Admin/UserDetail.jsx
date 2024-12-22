import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { navigateToDashboard } from "../../utils/navigationUtils";
import { useToken } from "../../context/TokenContext";

const UserDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  const { token } = useToken();
  const [feedback, setFeedback] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
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
      if (response.ok) {
        alert("User Approved Successfully!");
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
      const response = await fetch(
        `http://localhost:7001/api/admin/reject-manager/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback }),
        }
      );
      if (response.ok) {
        alert("User Rejected Successfully!");
        navigateToDashboard(navigate);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Rejection failed!");
      }
    } catch (e) {
      console.error("Error while rejecting:", e);
      setError("Failed to reject the user.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <p className="text-red-500 text-center">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center md:text-left">
          User Details
        </h2>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center md:text-left">
            Review User Application
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Trust Name", value: user.name_of_trust },
              { label: "Email", value: user.email },
              { label: "Phone", value: user.phone },
              { label: "Address", value: user.head_office_address },
              { label: "City", value: user.head_office_city },
              { label: "State", value: user.head_office_state },
              { label: "Country", value: user.head_office_country },
              { label: "Estd", value: user.yearOfEstablishment },
              {
                label: "Trust Document",
                value: (
                  <a
                    href={`http://localhost:7001/api/files/file/${user.trust_document}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Document
                  </a>
                ),
              },
              {
                label: "Financial Statements",
                value: (
                  <a
                    href={`http://localhost:7001/api/files/file/${user.financial_statements}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Financials
                  </a>
                ),
              },
              {
                label: "Trust Domicile",
                value: (
                  <a
                    href={`http://localhost:7001/api/files/file/${user.trust_domicile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Domicile
                  </a>
                ),
              },
              { label: "Status", value: user.status },
            ].map((item, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700">
                  {item.label}:
                </label>
                <p className="text-gray-800 break-words">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full md:w-auto"
            >
              Approve
            </button>
            <button
              onClick={() => {
                setError("");
                setFeedback("");
                setShowFeedbackInput(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded w-full md:w-auto"
            >
              Reject
            </button>
          </div>

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
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full md:w-auto"
              >
                Submit Feedback
              </button>
            </div>
          )}

          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
