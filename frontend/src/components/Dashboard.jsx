import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { navigateToUserDetail } from "../utils/navigationUtils";
const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [applicants, setApplicants] = useState([]);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state?.profile;

  useEffect(() => {
    if (!profile || profile.role !== "admin" || !token) {
      setMessage("Unauthorized Access");
      navigate("/login");
    }
  }, [profile, navigate, token]);

  useEffect(() => {
    const fetchNumberofApplicants = async () => {
      if (profile && profile.role === "admin") {
        try {
          const response = await fetch(
            "http://localhost:7001/api/admin/pending-managers",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setApplicants(data);
        } catch (e) {
          console.error("Error Fetching the Pending Managers", e);
        }
      }
    };
    fetchNumberofApplicants();
  }, [profile, token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar profile={profile} />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h2>
        {message && <p className="text-red-500">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <div
              key={applicant._id.$oid}
              className="flex bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Trust Logo */}
              <div className="w-1/3">
                <img
                  src={`http://localhost:7001/api/files/file/${applicant.trust_logo}`}
                  alt={`${applicant.name_of_trust} Logo`}
                  className="object-cover h-full w-full"
                />
              </div>

              {/* Card Content */}
              <div className="w-2/3 p-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {applicant.name_of_trust}
                </h3>
                <p className="text-sm text-gray-600">
                  {applicant.head_office_address}
                </p>
                <p className="text-sm text-gray-600">
                  Email: {applicant.email}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {applicant.phone}
                </p>
                {/* navigate(`/user-detail`, {
                      state: { user: applicant, profile },
                    }) */}
                {/* View Button */}
                <button
                  onClick={() =>
                    navigateToUserDetail(navigate, applicant, profile)
                  }
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
