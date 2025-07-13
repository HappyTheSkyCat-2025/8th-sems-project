import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function RegionForm() {
  const [name, setName] = useState("");
  const { id } = useParams(); // undefined for create
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("access_token");
      axios
        .get(`/api/destinations/regions/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setName(res.data.name))
        .catch((err) => alert("Failed to load region data."));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    try {
      if (id) {
        await axios.put(
          `/api/destinations/regions/${id}/`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "/api/destinations/regions/",
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate("/admin/regions");
    } catch (error) {
      alert("Failed to save region. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ marginBottom: "24px", fontWeight: "700", color: "#333" }}>
        {id ? "Edit" : "Create"} Region
      </h2>

      <label
        htmlFor="regionName"
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "600",
          color: "#555",
          fontSize: "14px",
        }}
      >
        Region Name
      </label>

      <input
        id="regionName"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter region name"
        required
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "6px",
          border: "1.5px solid #ccc",
          fontSize: "16px",
          marginBottom: "24px",
          outline: "none",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <button
        type="submit"
        style={{
          backgroundColor: "#1e88e5",
          color: "#fff",
          padding: "12px 20px",
          border: "none",
          borderRadius: "6px",
          fontWeight: "600",
          fontSize: "16px",
          cursor: "pointer",
          width: "100%",
          boxShadow: "0 4px 8px rgba(30,136,229,0.4)",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1e88e5")}
      >
        {id ? "Update" : "Create"}
      </button>
    </form>
  );
}
