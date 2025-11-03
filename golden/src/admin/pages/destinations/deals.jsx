import React, { useState } from "react";
import "./deals.css";

const TravelDealList = () => {
  const [filter, setFilter] = useState("All");
  const [deals, setDeals] = useState([
    {
      id: 1,
      country: "Nepal",
      category: "Adventure",
      places: "Kathmandu, Pokhara",
      city: "Kathmandu",
      map: "https://goo.gl/maps/123",
      title: "Everest Base Camp Trek",
      days: "12 Days",
      price: "$1200",
      subtitle: "Explore the world's highest peaks",
      image: "",
      themes: "Trekking, Nature",
      tag: "On Sale",
      styles: "Outdoor, Group",
      description: "A lifetime adventure to the foot of Mount Everest.",
    },
    {
      id: 2,
      country: "France",
      category: "Romantic",
      places: "Paris, Nice",
      city: "Paris",
      map: "https://goo.gl/maps/abc",
      title: "Romantic Paris Getaway",
      days: "5 Days",
      price: "$1800",
      subtitle: "Love and lights in the city of romance",
      image: "",
      themes: "Romance, Culture",
      tag: "Last Minute",
      styles: "Luxury, Couple",
      description: "Experience the romantic charm of Paris with your partner.",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    country: "",
    category: "",
    places: "",
    city: "",
    map: "",
    title: "",
    days: "",
    price: "",
    subtitle: "",
    image: "",
    themes: "",
    tag: "",
    styles: "",
    description: "",
  });

  const openAddModal = () => {
    setCurrent({
      id: null,
      country: "",
      category: "",
      places: "",
      city: "",
      map: "",
      title: "",
      days: "",
      price: "",
      subtitle: "",
      image: "",
      themes: "",
      tag: "",
      styles: "",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent(item);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      setCurrent((prev) => ({ ...prev, image: imageUrl }));
    } else {
      setCurrent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (current.id) {
      setDeals((prev) => prev.map((d) => (d.id === current.id ? current : d)));
    } else {
      setDeals((prev) => [...prev, { ...current, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeals(deals.filter((d) => d.id !== id));
  };

  const filteredDeals =
    filter === "All" ? deals : deals.filter((d) => d.tag === filter);

  return (
    <div className="deal-container">
      <div className="deal-header">
        <h2>🎫 Travel Deals</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add Deal
        </button>
      </div>

      {/* Filter */}
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

      {/* Cards */}
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
                <strong>Country:</strong> {d.country}
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
              <button className="delete-btn" onClick={() => handleDelete(d.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{current.id ? "Edit Deal" : "Add New Deal"}</h3>

            {Object.keys(current).map((key) =>
              key === "id" ? null : key === "image" ? (
                <div className="form-group" key={key}>
                  <label>Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {current.image && (
                    <img
                      src={current.image}
                      alt="Preview"
                      className="preview-img"
                    />
                  )}
                </div>
              ) : (
                <div className="form-group" key={key}>
                  {key === "description" ? (
                    <textarea
                      name={key}
                      rows="3"
                      value={current[key]}
                      onChange={handleChange}
                      placeholder={key}
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={current[key]}
                      onChange={handleChange}
                      placeholder={key}
                    />
                  )}
                  <label>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
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
