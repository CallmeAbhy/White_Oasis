import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { useProfile } from "../context/ProfileContext";
import { useToken } from "../context/TokenContext";

const Home = () => {
  const { setProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useToken();

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `http://localhost:7001/api/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
          navigate("/login");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, setProfile, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      {/* Add your home page content here */}
    </>
  );
};

export default Home;
