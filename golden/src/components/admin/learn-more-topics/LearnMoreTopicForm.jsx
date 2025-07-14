import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function LearnMoreTopicForm() {
  const { country_slug, id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    image: null,
  });

  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing data if editing
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("access_token");
      axios
        .get(`/api/destinations/countries/${country_slug}/learn-more-topics/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setFormData({
            title: res.data.title || "",
            description: res.data.description || "",
            order: res.data.order || 0,
            image: null,
          });
          setExistingImageUrl(res.data.image_url || null);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load topic data.");
          setLoading(false);
        });
    }
  }, [country_slug, id]);

  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("access_token");
    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (key === "image") {
        if (val) data.append("image", val);
      } else if (val !== null && val !== "") {
        data.append(key, val);
      }
    });

    try {
      if (id) {
        await axios.put(
          `/api/destinations/countries/${country_slug}/learn-more-topics/${id}/`,
          data,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          `/api/destinations/countries/${country_slug}/learn-more-topics/`,
          data,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
      }
      setSaving(false);
      navigate(`/admin/countries/${country_slug}/learn-more-topics`);
    } catch (err) {
      setSaving(false);
      setError("Failed to save topic. Please check your data.");
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
      encType="multipart/form-data"
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
        {id ? "Edit" : "Create"} Learn More Topic
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: "16px", fontWeight: "600" }}>
          {error}
        </p>
      )}

      <label htmlFor="title" style={labelStyle}>
        Title:
      </label>
      <input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        required
        placeholder="Enter title"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="description" style={labelStyle}>
        Description:
      </label>
      <textarea
        id="description"
        name="description"
        rows={5}
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter description"
        style={{ ...inputStyle, height: "120px", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="order" style={labelStyle}>
        Order:
      </label>
      <input
        id="order"
        name="order"
        type="number"
        value={formData.order}
        onChange={handleChange}
        placeholder="Enter order"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="image" style={labelStyle}>
        Image:
      </label>
      <input
        id="image"
        name="image"
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ marginBottom: "24px", cursor: "pointer" }}
      />

      {existingImageUrl && !formData.image && (
        <div style={{ marginBottom: "24px" }}>
          <p>Current Image Preview:</p>
          <img
            src={existingImageUrl}
            alt="Current"
            style={{ maxWidth: 300, borderRadius: 8 }}
          />
        </div>
      )}

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
