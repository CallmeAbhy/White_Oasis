import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { navigateToUserDetail } from "../../utils/navigationUtils";
import { useToken } from "../../context/TokenContext";
import { useProfile } from "../../context/ProfileContext";
import ContactForm from "../Common/Components/ContactForm";
import Footer from "../Common/Components/Footer";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [applicants, setApplicants] = useState([]);
  const { token } = useToken();
  const navigate = useNavigate();
  const { profile } = useProfile();

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
            `${import.meta.env.VITE_API_URL}/api/admin/pending-managers`,
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
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Dashboard</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicants.map((applicant) => (
            <div
              key={applicant._id.$oid}
              className="flex bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            >
              {/* Trust Logo */}
              <div className="w-1/3">
                <img
                  src={`${import.meta.env.VITE_API_URL}/api/files/file/${
                    applicant.trust_logo
                  }`}
                  alt={`${applicant.name_of_trust} Logo`}
                  className="object-contain h-full w-full p-2" // Use object-contain to ensure the logo is fully visible
                />
              </div>

              {/* Card Content */}
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
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
                </div>
                {/* View Button */}
                <button
                  onClick={() => navigateToUserDetail(navigate, applicant)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Dashboard;
