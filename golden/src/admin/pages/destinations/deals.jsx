import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./deals.css";

const TravelDealList = () => {
  const [filter, setFilter] = useState("All");
  const [deals, setDeals] = useState([]);
  const [countries, setCountries] = useState([]);
  const [categories] = useState([
    { id: "adventure", name: "Adventure" },
    { id: "culture", name: "Culture" },
    { id: "group-travel", name: "Group Travel" },
  ]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    country_id: "",
    category_id: "",
    places: "",
    city: "",
    map: "",
    title: "",
    days: "",
    price: "",
    subtitle: "",
    image: null,
    themes: "",
    tag: "",
    styles: "",
    description: "",
  });

  // Fetch deals and countries
  const fetchDeals = async () => {
    setLoading(true);
    try {
      const [dealsRes, countriesRes] = await Promise.all([
        axiosInstance.get("admin-dashboard/travel-deals/"),
        axiosInstance.get("admin-dashboard/countries/"),
      ]);
      setDeals(dealsRes.data.results || dealsRes.data);
      setCountries(countriesRes.data.results || countriesRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const openAddModal = () => {
    setCurrent({
      id: null,
      country_id: "",
      category_id: "",
      places: "",
      city: "",
      map: "",
      title: "",
      days: "",
      price: "",
      subtitle: "",
      image: null,
      themes: "",
      tag: "",
      styles: "",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent({
      ...item,
      country_id: item.country?.id || item.country_id,
      category_id: item.category?.id || item.category_id,
      image: null, // image will be uploaded again if editing
      themes: item.themes ? item.themes.join(",") : "",
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setCurrent((prev) => ({ ...prev, image: files[0] }));
    } else {
      setCurrent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      Object.keys(current).forEach((key) => {
        if (key === "id" || !current[key]) return;

        if (key === "image" && current.image instanceof File) {
          formData.append("image", current.image);
        } else if (key === "themes") {
          const themesValue = current.themes
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
          formData.append("themes", JSON.stringify(themesValue));
        } else {
          formData.append(key, current[key]);
        }
      });

      const url = current.id
        ? `admin-dashboard/travel-deals/${current.id}/`
        : "admin-dashboard/travel-deals/";
      const method = current.id ? "put" : "post";

      await axiosInstance({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchDeals();
      setModalOpen(false);
      alert("✅ Deal saved successfully!");
    } catch (err) {
      console.error("Failed to save deal:", err.response?.data || err);
      alert("Failed to save deal. Make sure all required fields are filled!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await axiosInstance.delete(`admin-dashboard/travel-deals/${id}/`);
        setDeals((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        console.error("Failed to delete deal:", err);
        alert("Failed to delete deal.");
      }
    }
  };

  const filteredDeals =
    filter === "All" ? deals : deals.filter((d) => d.tag === filter);

  if (loading) return <p>Loading deals...</p>;

  return (
    <div className="deal-container">
      <div className="deal-header">
        <h2>🎫 Travel Deals</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add Deal
        </button>
      </div>

      <div className="filter-bar">
        {["All", "On Sale", "Last Minute"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="deal-grid">
        {filteredDeals.map((d) => (
          <div className="deal-card" key={d.id}>
            <img
              src={
                d.image ||
                "https://cdn-icons-png.flaticon.com/512/854/854878.png"
              }
              alt={d.title}
              className="deal-image"
            />
            <div className="deal-info">
              <h3>{d.title}</h3>
              <p className="subtitle">{d.subtitle}</p>
              <p>
                <strong>Country:</strong> {d.country?.name || d.country_id || "—"}
              </p>
              <p>
                <strong>Days:</strong> {d.days}
              </p>
              <p>
                <strong>Price:</strong> {d.price}
              </p>
              <p className="tag">{d.tag}</p>
            </div>
            <div className="deal-actions">
              <button className="edit-btn" onClick={() => openEditModal(d)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(d.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{current.id ? "Edit Deal" : "Add New Deal"}</h3>

            <div className="form-group">
              <label>Country</label>
              <select
                name="country_id"
                value={current.country_id}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category_id"
                value={current.category_id}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {Object.keys(current)
              .filter((key) => !["id", "country_id", "category_id"].includes(key))
              .map((key) =>
                key === "image" ? (
                  <div className="form-group" key={key}>
                    <label>Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    {current.image && current.image instanceof File && (
                      <img
                        src={URL.createObjectURL(current.image)}
                        alt="Preview"
                        className="preview-img"
                      />
                    )}
                  </div>
                ) : key === "description" ? (
                  <div className="form-group" key={key}>
                    <label>{key}</label>
                    <textarea
                      name={key}
                      rows="3"
                      value={current[key]}
                      onChange={handleChange}
                      placeholder={key}
                    />
                  </div>
                ) : (
                  <div className="form-group" key={key}>
                    <label>{key}</label>
                    <input
                      type="text"
                      name={key}
                      value={current[key]}
                      onChange={handleChange}
                      placeholder={key}
                    />
                  </div>
                )
              )}

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDealList;
