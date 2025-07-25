import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const BlogForm = ({ blog, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    tags: "",
    author: "",
    category: "",
    country: "",
    thumbnail: null,
  });

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        content: blog.content || "",
        status: blog.status || "draft",
        tags: blog.tags || "",
        author: blog.author?.id || blog.author || "",
        category: blog.category?.id || blog.category || "",
        country: blog.country?.id || blog.country || "",
        thumbnail: null, // Don't preload image
      });
    }
  }, [blog]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [authorRes, categoryRes, countryRes] = await Promise.all([
          axiosInstance.get("admin-dashboard/users/"),
          axiosInstance.get("admin-dashboard/categories/"),
          axiosInstance.get("admin-dashboard/countries/"),
        ]);
        setAuthors(authorRes.data.results || authorRes.data);
        setCategories(categoryRes.data.results || categoryRes.data);
        setCountries(countryRes.data.results || countryRes.data);
      } catch (err) {
        console.error("Error loading form options", err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    }

    onSave(data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{blog ? "Edit Blog" : "Create Blog"}</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />

          <select name="author" value={formData.author} onChange={handleChange} required>
            <option value="">Select Author</option>
            {authors.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>

          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Content"
            rows={5}
          />

          <input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
          />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <input type="file" name="thumbnail" onChange={handleChange} accept="image/*" />

          {/* Thumbnail Preview */}
          {formData.thumbnail && typeof formData.thumbnail === "object" && (
            <img
              src={URL.createObjectURL(formData.thumbnail)}
              alt="Preview"
              style={{ width: "100%", margin: "1rem 0" }}
            />
          )}

          <button type="submit">{blog ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
