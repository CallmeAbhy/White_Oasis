import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = ({ user }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:7001/api/users/${user.role}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request headers
            },
          }
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchProfile();
  }, [user]);

  if (!profileData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profileData.message}</h1>
      <p>Username: {profileData.user.username}</p>
      <p>Email: {profileData.user.email}</p>
      {/* Add more user details as needed */}
    </div>
  );
};

export default ProfilePage;
