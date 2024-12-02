// src/components/Dashboard.js

import { useEffect, useState } from "react";

import axios from "axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:7001/api/users/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessage(response.data.message);
      } catch (error) {
        alert("Error fetching message: " + error.response.data.message);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <p>{message}</p>
    </div>
  );
};
export default Dashboard;
