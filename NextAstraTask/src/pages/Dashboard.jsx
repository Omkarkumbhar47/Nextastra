import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // Redirect to login if no token
      }

      try {
        const response = await axios.get("http://localhost:5000/api/protected", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setMessage(response.data.message); // Display protected message
      } catch (err) {
        navigate("/login"); // Redirect to login if the token is invalid
      }
    };

    fetchProtectedData();
  }, [navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
