import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./article.css";

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    country: "", // store country ID
    location: "",
    description: "",
    image: null,
    suggested: false,
    inspirational: false,
  });

  // Fetch all articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin-dashboard/articles/");
      setArticles(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      alert("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/countries/");
      setCountries(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCountries();
  }, []);

  const openModal = (article = null) => {
    if (article) {
      setSelected(article);
      setFormData({
        title: article.title,
        country: article.country?.id || "", // store ID
        location: article.location,
        description: article.description || "",
        image: null,
        suggested: article.suggested,
        inspirational: article.inspirational,
      });
    } else {
      setSelected(null);
      setFormData({
        title: "",
        country: "",
        location: "",
        description: "",
        image: null,
        suggested: false,
        inspirational: false,
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const saveArticle = async () => {
    if (!formData.country) {
      return alert("Please select a country.");
    }
    if (!formData.description) {
      return alert("Description is required.");
    }

    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });

      if (selected) {
        await axiosInstance.put(
          `/admin-dashboard/articles/${selected.id}/`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axiosInstance.post(
          `/admin-dashboard/articles/`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      fetchArticles();
      closeModal();
      alert("✅ Article saved successfully!");
    } catch (err) {
      console.error("Failed to save article:", err.response?.data || err);
      alert("Failed to save article. Check all fields.");
    }
  };

  const deleteArticle = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await axiosInstance.delete(`/admin-dashboard/articles/${id}/`);
        setArticles(articles.filter((a) => a.id !== id));
        alert("🗑️ Article deleted!");
      } catch (err) {
        console.error("Failed to delete article:", err);
        alert("Failed to delete article.");
      }
    }
  };

  if (loading) return <p>Loading articles...</p>;

  return (
    <div className="article-container">
      <h2 className="article-heading">🗞️ Articles</h2>
      <p className="article-subtitle">
        Create and manage travel-related articles and guides.
      </p>
      <button className="add-btn" onClick={() => openModal()}>
        + Add New Article
      </button>

      <div className="article-table-wrapper">
        <table className="article-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hide-mobile">Country</th>
              <th className="hide-mobile">Location</th>
              <th className="hide-mobile">Image</th>
              <th className="hide-mobile">Suggested</th>
              <th className="hide-mobile">Inspirational</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td className="hide-mobile">{article.country?.name || ""}</td>
                <td className="hide-mobile">{article.location}</td>
                <td className="hide-mobile">
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="article-img-circle"
                    />
                  )}
                </td>
                <td className="hide-mobile">
                  <input type="checkbox" checked={article.suggested} readOnly />
                </td>
                <td className="hide-mobile">
                  <input type="checkbox" checked={article.inspirational} readOnly />
                </td>
                <td>
                  <button className="details-btn" onClick={() => openModal(article)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteArticle(article.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content scrollable" onClick={(e) => e.stopPropagation()}>
            <h3>{selected ? "Edit Article" : "Add New Article"}</h3>

            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Country</label>
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="">Select a country</option>
                {Array.isArray(countries) &&
                  countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <input type="file" name="image" onChange={handleChange} />
              {selected?.image && !formData.image && (
                <img src={selected.image} alt="Preview" className="modal-img" />
              )}
              {formData.image && (
                <img src={URL.createObjectURL(formData.image)} alt="Preview" className="modal-img" />
              )}
            </div>

            <div className="checkbox-row">
              <label>
                <input type="checkbox" name="suggested" checked={formData.suggested} onChange={handleChange} />
                Suggested
              </label>
            </div>

            <div className="checkbox-row">
              <label>
                <input type="checkbox" name="inspirational" checked={formData.inspirational} onChange={handleChange} />
                Inspirational
              </label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveArticle}>Save</button>
              <button className="close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
