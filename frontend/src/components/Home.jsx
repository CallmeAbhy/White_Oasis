import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
//useParams
import axios from "axios";
import Navbar from "./Navbar";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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
        } catch (e) {
          console.error(`Error Fetching Profile`, e);
          navigate("/login");
        } finally {
          setLoading(false);
        }
      } else {
        // If no ID or token, just set loading to false
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar profile={profile} />
    </>
  );
};

export default Home;
