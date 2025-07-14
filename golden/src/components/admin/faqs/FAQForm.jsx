import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function FAQForm() {
  const { country_slug, id } = useParams();
  const navigate = useNavigate();

  const [countryId, setCountryId] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load country ID
  useEffect(() => {
    axios
      .get(`/api/destinations/countries/${country_slug}/`)
      .then((res) => setCountryId(res.data.id))
      .catch(() => setError("Failed to load country"))
      .finally(() => setLoading(false));
  }, [country_slug]);

  // Load existing FAQ if editing
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/destinations/countries/${country_slug}/faqs/${id}/`)
        .then((res) => {
          setFormData({
            question: res.data.question || "",
            answer: res.data.answer || "",
          });
        })
        .catch(() => setError("Failed to load FAQ"))
        .finally(() => setLoading(false));
    }
  }, [id, country_slug]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!countryId) {
      setError("Country not loaded yet.");
      return;
    }
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("access_token");
    const data = { ...formData, country: countryId };

    try {
      if (id) {
        await axios.put(
          `/api/destinations/countries/${country_slug}/faqs/${id}/`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `/api/destinations/countries/${country_slug}/faqs/`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate(`/admin/countries/${country_slug}/faqs`);
    } catch (err) {
      setError("Failed to save FAQ");
      console.error(err.response?.data || err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  // Styles
  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "6px",
    border: "1.5px solid #ccc",
    fontSize: "16px",
    marginBottom: "24px",
    outline: "none",
    transition: "border-color 0.2s",
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
        {id ? "Edit" : "Create"} FAQ
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: "16px", fontWeight: "600" }}>
          {error}
        </p>
      )}

      <label htmlFor="question" style={labelStyle}>
        Question:
      </label>
      <textarea
        id="question"
        name="question"
        rows={3}
        value={formData.question}
        onChange={handleChange}
        required
        placeholder="Enter the FAQ question"
        style={{
          ...inputStyle,
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: "1.5",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="answer" style={labelStyle}>
        Answer:
      </label>
      <textarea
        id="answer"
        name="answer"
        rows={5}
        value={formData.answer}
        onChange={handleChange}
        required
        placeholder="Enter the FAQ answer"
        style={{
          ...inputStyle,
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: "1.5",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

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
