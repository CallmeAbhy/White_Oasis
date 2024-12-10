import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import Navbar from "./Navbar";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchProfile = async () => {
      if (id && token) {
        try {
          const response = await axios.get(
            `http://localhost:7001/api/users/profile/${id}`,
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
  }, [id, navigate, token]);

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
