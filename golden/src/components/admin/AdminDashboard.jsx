import React, { useEffect, useState } from "react";
import { FaGlobe, FaMapMarkedAlt, FaSuitcase, FaStar } from "react-icons/fa";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    regions: 0,
    countries: 0,
    travel_deals: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get("/api/destinations/admin/stats/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch admin stats:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const statItems = [
    { label: "Regions", value: stats.regions, icon: <FaGlobe />, color: "#1e88e5" },
    { label: "Countries", value: stats.countries, icon: <FaMapMarkedAlt />, color: "#43a047" },
    { label: "Travel Deals", value: stats.travel_deals, icon: <FaSuitcase />, color: "#fb8c00" },
    { label: "Reviews", value: stats.reviews, icon: <FaStar />, color: "#f4511e" },
  ];

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "25px" }}>
        Welcome, Admin 👋
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {statItems.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              transition: "0.3s ease",
            }}
          >
            <div
              style={{
                backgroundColor: item.color,
                color: "#fff",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "20px",
                marginRight: "15px",
              }}
            >
              {item.icon}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: "16px", color: "#555" }}>{item.label}</h4>
              <p style={{ fontSize: "22px", fontWeight: "600", margin: 0 }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
