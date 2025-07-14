import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function CountryOverviewForm() {
  const { country_slug, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    capital: "",
    population: "",
    currency: "",
    language: "",
    timezone: "",
    calling_code: "",
    electricity: "",
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing data if editing
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("access_token");
      axios
        .get(`/api/destinations/countries/${country_slug}/overview/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load overview data.");
          setLoading(false);
        });
    }
  }, [country_slug, id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("access_token");

    try {
      if (id) {
        await axios.put(
          `/api/destinations/countries/${country_slug}/overview/${id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `/api/destinations/countries/${country_slug}/overview/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSaving(false);
      navigate(`/admin/countries/${country_slug}/overview`);
    } catch (err) {
      setSaving(false);
      setError("Failed to save overview. Please check your data.");
      console.error(err.response?.data || err.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1.5px solid #ccc",
    fontSize: "16px",
    marginBottom: "24px",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#555",
    fontSize: "14px",
  };

  const buttonStyle = {
    backgroundColor: "#1e88e5",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: saving ? "not-allowed" : "pointer",
    width: "100%",
    boxShadow: "0 4px 8px rgba(30,136,229,0.4)",
    transition: "background-color 0.3s",
    opacity: saving ? 0.7 : 1,
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
        {id ? "Edit" : "Create"} Country Overview
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: "16px", fontWeight: "600" }}>
          {error}
        </p>
      )}

      {[
        { label: "Capital", name: "capital" },
        { label: "Population", name: "population" },
        { label: "Currency", name: "currency" },
        { label: "Language", name: "language" },
        { label: "Timezone", name: "timezone" },
        { label: "Calling Code", name: "calling_code" },
        { label: "Electricity", name: "electricity" },
      ].map(({ label, name }) => (
        <div key={name}>
          <label htmlFor={name} style={labelStyle}>
            {label}:
          </label>
          <input
            id={name}
            name={name}
            type="text"
            value={formData[name]}
            onChange={handleChange}
            placeholder={`Enter ${label.toLowerCase()}`}
            style={inputStyle}
            required={name !== "timezone" && name !== "calling_code" && name !== "electricity"}
            onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={saving}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!saving) e.target.style.backgroundColor = "#1565c0";
        }}
        onMouseLeave={(e) => {
          if (!saving) e.target.style.backgroundColor = "#1e88e5";
        }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
