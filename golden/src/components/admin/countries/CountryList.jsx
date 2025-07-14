import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CountryList() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get("/api/destinations/countries/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCountries(res.data.results || res.data))
      .catch(() => alert("Failed to load countries."));
  }, []);

  const deleteCountry = (slug) => {
    if (window.confirm("Delete this country?")) {
      const token = localStorage.getItem("access_token");
      axios
        .delete(`/api/destinations/countries/${slug}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setCountries((prev) => prev.filter((c) => c.slug !== slug)))
        .catch(() => alert("Failed to delete country."));
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontWeight: 600 }}>🌎 Countries</h2>
        <Link
          to="/admin/countries/create"
          style={{
            backgroundColor: "#1e88e5",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          + Add Country
        </Link>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <thead style={{ background: "#f7f7f7" }}>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Region</th>
            <th style={thStyle}>Deals</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {countries.length > 0 ? (
            countries.map((country) => (
              <tr key={country.slug} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{country.id}</td>
                <td style={tdStyle}>{country.name}</td>
                <td style={tdStyle}>{country.region || "-"}</td>
                <td style={tdStyle}>
                  <Link
                    to={`/admin/countries/${country.slug}/travel-deals`}
                    style={btnManage}
                  >
                    Manage Deals
                  </Link>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <Link
                    to={`/admin/countries/${country.slug}/edit`}
                    style={btnEdit}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCountry(country.slug)}
                    style={btnDelete}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#777" }}>
                No countries found.
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

const btnManage = {
  background: "#17a2b8",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "4px",
  fontSize: "13px",
  cursor: "pointer",
  textDecoration: "none",
};
