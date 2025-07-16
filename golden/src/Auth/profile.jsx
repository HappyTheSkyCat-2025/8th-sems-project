// src/pages/profile.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/accounts/profile/");
        setProfile(response.data);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p style={{ padding: "80px 20px", textAlign: "center" }}>Loading profile...</p>;
  if (error) return <p style={{ padding: "80px 20px", textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "80px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Profile</h2>
      <div>
        <strong>Username:</strong> {profile.username}
      </div>
      <div>
        <strong>Email:</strong> {profile.email}
      </div>
      <div>
        <strong>Nationality:</strong> {profile.nationality || "Not specified"}
      </div>
      <div>
        <strong>Superuser:</strong> {profile.is_superuser ? "Yes" : "No"}
      </div>
      <div>
        <strong>Preferences:</strong> {Object.keys(profile.preferences).length ? JSON.stringify(profile.preferences) : "None"}
      </div>
      <div>
        <strong>Travel History:</strong>{" "}
        {profile.travel_history.length
          ? profile.travel_history.join(", ")
          : "No travel history"}
      </div>
      {/* You can add more fields as needed */}
    </div>
  );
}
