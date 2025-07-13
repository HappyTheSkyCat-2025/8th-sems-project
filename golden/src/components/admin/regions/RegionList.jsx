import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function RegionList() {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("/api/destinations/regions/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRegions(res.data.results || res.data))
      .catch(() => alert("Failed to load regions."));
  }, []);

  const deleteRegion = (id) => {
    if (window.confirm("Delete this region?")) {
      const token = localStorage.getItem("access_token");
      axios
        .delete(`/api/destinations/regions/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setRegions((prev) => prev.filter((r) => r.id !== id));
        })
        .catch(() => alert("Failed to delete region."));
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontWeight: "600" }}>🌍 Regions</h2>
        <Link
          to="/admin/regions/create"
          style={{
            backgroundColor: "#1e88e5",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          + Add Region
        </Link>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <thead style={{ background: "#f7f7f7" }}>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region) => (
            <tr key={region.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={tdStyle}>{region.id}</td>
              <td style={tdStyle}>{region.name}</td>
              <td style={{ ...tdStyle, textAlign: "right" }}>
                <Link to={`/admin/regions/${region.id}/edit`} style={btnEdit}>
                  Edit
                </Link>
                <button onClick={() => deleteRegion(region.id)} style={btnDelete}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {regions.length === 0 && (
            <tr>
              <td
                colSpan="3"
                style={{ textAlign: "center", padding: "20px", color: "#777" }}
              >
                No regions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  fontWeight: "600",
  fontSize: "14px",
  color: "#333",
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#444",
};

const btnEdit = {
  marginRight: "10px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  textDecoration: "none",
  fontSize: "13px",
  cursor: "pointer",
};

const btnDelete = {
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  fontSize: "13px",
  cursor: "pointer",
};
