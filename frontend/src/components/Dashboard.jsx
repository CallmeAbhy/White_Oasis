// src/components/Dashboard.js

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const { token, role } = user;

      try {
        const response = await axios.get(
          `http://localhost:7001/api/users/${role}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessage(response.data.message);
      } catch (error) {
        alert("Error fetching message: " + error.response.data.message);
      }
    };

    if (user.token) {
      fetchMessage();
    }
  }, [user]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
