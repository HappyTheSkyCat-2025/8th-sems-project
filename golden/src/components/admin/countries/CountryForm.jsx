import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function CountryForm() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [regions, setRegions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    region: null, // Use null initially, number expected
    subtitle: "",
    section_title: "",
    description: "",
    video_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch regions
  useEffect(() => {
    axios
      .get("/api/destinations/regions/")
      .then((res) => {
        const data = res.data.results ? res.data.results : res.data;
        setRegions(data);
      })
      .catch((err) => console.error("Failed to load regions", err));
  }, []);

  // Fetch existing country for edit
  useEffect(() => {
    if (slug) {
      axios
        .get(`/api/destinations/countries/${slug}/`)
        .then((res) => {
          const data = res.data;
          setFormData({
            name: data.name || "",
            slug: data.slug || "",
            // IMPORTANT: region should be number or null
            region:
              data.region && typeof data.region === "object"
                ? data.region.id
                : data.region || null,
            subtitle: data.subtitle || "",
            section_title: data.section_title || "",
            description: data.description || "",
            video_url: data.video_url || "",
          });
          setImagePreview(data.image || "");
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load country", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [slug]);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // region should be number or null, others strings
      [name]: name === "region" ? (value === "" ? null : Number(value)) : value,
    }));
  }

  // Handle file input
  function handleFileChange(e) {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    if (formData.region !== null) {
      data.append("region", formData.region); // number
    }
    data.append("subtitle", formData.subtitle);
    data.append("section_title", formData.section_title);
    data.append("description", formData.description);
    data.append("video_url", formData.video_url);
    if (imageFile) data.append("image", imageFile);

    const token = localStorage.getItem("access_token");

    try {
      if (slug) {
        await axios.put(`/api/destinations/countries/${slug}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post("/api/destinations/countries/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setSaving(false);
      navigate("/admin/countries");
    } catch (err) {
      setSaving(false);
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to save country. Please check the data and try again."
      );
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
        {slug ? "Edit" : "Create"} Country
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: "16px", fontWeight: "600" }}>
          {error}
        </p>
      )}

      <label htmlFor="name" style={labelStyle}>
        Name:
      </label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Enter country name"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="slug" style={labelStyle}>
        Slug (optional):
      </label>
      <input
        id="slug"
        name="slug"
        type="text"
        value={formData.slug}
        onChange={handleChange}
        placeholder="Leave blank to auto-generate"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="region" style={labelStyle}>
        Region:
      </label>
      <select
        id="region"
        name="region"
        value={formData.region === null ? "" : formData.region}
        onChange={handleChange}
        required
        style={{ ...inputStyle, paddingRight: "40px", cursor: "pointer" }}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      >
        <option value="">Select a region</option>
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>

      <label htmlFor="subtitle" style={labelStyle}>
        Subtitle:
      </label>
      <input
        id="subtitle"
        name="subtitle"
        type="text"
        value={formData.subtitle}
        onChange={handleChange}
        placeholder="Enter subtitle"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="section_title" style={labelStyle}>
        Section Title:
      </label>
      <input
        id="section_title"
        name="section_title"
        type="text"
        value={formData.section_title}
        onChange={handleChange}
        placeholder="Enter section title"
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
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter description"
        style={{
          ...inputStyle,
          height: "100px",
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: "1.5",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="video_url" style={labelStyle}>
        Video URL:
      </label>
      <input
        id="video_url"
        name="video_url"
        type="url"
        value={formData.video_url}
        onChange={handleChange}
        placeholder="Enter video URL"
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
        onChange={handleFileChange}
        style={{ marginBottom: "24px", cursor: "pointer" }}
      />

      {imagePreview && (
        <div style={{ marginBottom: "24px" }}>
          <img
            src={imagePreview}
            alt="Country preview"
            style={{ maxWidth: 200, maxHeight: 120, objectFit: "cover" }}
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
