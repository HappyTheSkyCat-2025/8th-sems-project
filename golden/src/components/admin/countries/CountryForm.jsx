import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function TravelDealForm() {
  const { country_slug, slug } = useParams(); // country_slug + deal slug for edit
  const navigate = useNavigate();

  const [countryId, setCountryId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    days: 1,
    price: "",
    tag: "",
    style: "",
    description: "",
    themes: [],
    on_sale: false,
    last_minute: false,
    image: null,
  });

  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch country ID from slug
  useEffect(() => {
    axios
      .get(`/api/destinations/countries/${country_slug}/`)
      .then((res) => {
        setCountryId(res.data.id);
      })
      .catch((err) => {
        console.error("Failed to fetch country ID:", err);
        setError("Failed to load country data.");
      });
  }, [country_slug]);

  // Fetch existing deal for edit
  useEffect(() => {
    if (slug) {
      axios
        .get(`/api/destinations/countries/${country_slug}/travel-deals/${slug}/`)
        .then((res) => {
          const data = res.data;
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            days: data.days || 1,
            price: data.price || "",
            tag: data.tag || "",
            style: data.style || "",
            description: data.description || "",
            themes: Array.isArray(data.themes) ? data.themes : [],
            on_sale: data.on_sale || false,
            last_minute: data.last_minute || false,
            image: null,
          });
          setExistingImageUrl(data.image || null);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch deal:", err);
          setLoading(false);
          setError("Failed to load travel deal data.");
        });
    } else {
      setLoading(false);
    }
  }, [country_slug, slug]);

  // Handle input changes including themes and file
  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] || null }));
    } else if (name === "themes") {
      setFormData((prev) => ({
        ...prev,
        themes: value
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (!countryId) {
      setError("Country ID not loaded yet. Please wait.");
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("access_token");
    const data = new FormData();

    // Append all fields except themes and image (handle separately)
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "themes" || key === "image") return;
      if (val !== null && val !== "") {
        data.append(key, val);
      }
    });

    data.append("country", countryId);
    data.append("themes", JSON.stringify(formData.themes));

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (slug) {
        await axios.put(
          `/api/destinations/countries/${country_slug}/travel-deals/${slug}/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(
          `/api/destinations/countries/${country_slug}/travel-deals/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      setSaving(false);
      navigate(`/admin/countries/${country_slug}/travel-deals`);
    } catch (err) {
      setSaving(false);
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to save travel deal. Please try again."
      );
      console.error("Save error:", err.response?.data || err.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  // Styling (reuse or customize)
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
        {slug ? "Edit" : "Create"} Travel Deal
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

      <label htmlFor="days" style={labelStyle}>
        Days:
      </label>
      <input
        id="days"
        name="days"
        type="number"
        min={1}
        value={formData.days}
        onChange={handleChange}
        required
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="price" style={labelStyle}>
        Price:
      </label>
      <input
        id="price"
        name="price"
        type="text"
        value={formData.price}
        onChange={handleChange}
        required
        placeholder="Enter price"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="tag" style={labelStyle}>
        Tag:
      </label>
      <input
        id="tag"
        name="tag"
        type="text"
        value={formData.tag}
        onChange={handleChange}
        placeholder="Enter tag"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="style" style={labelStyle}>
        Style:
      </label>
      <input
        id="style"
        name="style"
        type="text"
        value={formData.style}
        onChange={handleChange}
        placeholder="Enter style"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="themes" style={labelStyle}>
        Themes (comma-separated):
      </label>
      <input
        id="themes"
        name="themes"
        type="text"
        value={formData.themes.join(", ")}
        onChange={handleChange}
        placeholder="Enter themes separated by commas"
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
        style={{
          ...inputStyle,
          height: "120px",
          resize: "vertical",
          fontFamily: "inherit",
          lineHeight: "1.5",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label
        htmlFor="on_sale"
        style={{ ...labelStyle, display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <input
          id="on_sale"
          name="on_sale"
          type="checkbox"
          checked={formData.on_sale}
          onChange={handleChange}
          style={{ width: 18, height: 18 }}
        />
        On Sale
      </label>

      <label
        htmlFor="last_minute"
        style={{ ...labelStyle, display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <input
          id="last_minute"
          name="last_minute"
          type="checkbox"
          checked={formData.last_minute}
          onChange={handleChange}
          style={{ width: 18, height: 18 }}
        />
        Last Minute
      </label>

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
