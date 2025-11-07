import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./lern.css";

const Learn = () => {
  const [lessons, setLessons] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [tempOrder, setTempOrder] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: "",
    country: "",
    description: "",
    image: null,
    order: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch lessons
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        "admin-dashboard/country-learn-more-topics/"
      );
      setLessons(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      alert("Failed to fetch lessons.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    try {
      const res = await axiosInstance.get("admin-dashboard/countries/");
      setCountries(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to fetch countries:", err);
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchCountries();
  }, []);

  const handleDetails = (item) => {
    setSelected(item);
    setTempOrder(item.order);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await axiosInstance.delete(
          `admin-dashboard/country-learn-more-topics/${id}/`
        );
        setLessons(lessons.filter((item) => item.id !== id));
        alert("🗑️ Lesson deleted!");
      } catch (err) {
        console.error("Failed to delete lesson:", err);
        alert("Failed to delete lesson.");
      }
    }
  };

  const handleSaveOrder = async () => {
    try {
      await axiosInstance.patch(
        `admin-dashboard/country-learn-more-topics/${selected.id}/`,
        {
          order: parseInt(tempOrder) || 0,
        }
      );
      fetchLessons();
      setSelected(null);
      alert("✅ Order updated successfully!");
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order.");
    }
  };

  const handleAddNew = async () => {
    if (
      !newLesson.title ||
      !newLesson.country ||
      !newLesson.description ||
      !newLesson.image
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("description", newLesson.description);
      formData.append("image", newLesson.image);
      formData.append("order", parseInt(newLesson.order) || 0);
      formData.append("country_id", String(newLesson.country)); // backend expects country_id

      await axiosInstance.post(
        "admin-dashboard/country-learn-more-topics/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      fetchLessons();
      setNewLesson({
        title: "",
        country: "",
        description: "",
        image: null,
        order: "",
      });
      setShowAddModal(false);
      alert("✅ Lesson added successfully!");
    } catch (err) {
      console.error("Failed to add lesson:", err.response?.data || err);
      alert("Failed to add lesson.");
    }
  };

  if (loading) return <p>Loading lessons...</p>;

  return (
    <div className="learn-container">
      <div className="learn-header">
        <div>
          <h2 className="learn-heading">📖 Learn</h2>
          <p className="learn-subtitle">
            Educational and informative content about destinations.
          </p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + Add Details
        </button>
      </div>

      <div className="learn-table-wrapper">
        <table className="learn-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hide-mobile">Country</th>
              <th className="hide-mobile">Description</th>
              <th className="hide-mobile">Image</th>
              <th className="hide-mobile">Order</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td className="hide-mobile">{item.country?.name}</td>
                <td className="hide-mobile">{item.description}</td>
                <td className="hide-mobile">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="learn-img-circle"
                  />
                </td>
                <td className="hide-mobile">{item.order}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => handleDetails(item)}
                  >
                    Details
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal-content fadeIn">
            <h3>Lesson Details</h3>
            <p>
              <strong>Title:</strong> {selected.title}
            </p>
            <p>
              <strong>Country:</strong> {selected.country?.name}
            </p>
            <p>
              <strong>Description:</strong> {selected.description}
            </p>
            <img
              src={selected.image}
              alt={selected.title}
              className="modal-img"
            />
            <div className="order-input">
              <label>
                <strong>Order:</strong>
              </label>
              <input
                type="number"
                value={tempOrder}
                onChange={(e) => setTempOrder(e.target.value)}
              />
            </div>
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSaveOrder}>
                Save
              </button>
              <button className="close-btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content fadeIn">
            <h3>Add New Lesson</h3>
            <input
              type="text"
              placeholder="Title"
              value={newLesson.title}
              onChange={(e) =>
                setNewLesson({ ...newLesson, title: e.target.value })
              }
            />

            <select
              value={newLesson.country}
              onChange={(e) =>
                setNewLesson({ ...newLesson, country: e.target.value })
              }
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={newLesson.description}
              onChange={(e) =>
                setNewLesson({ ...newLesson, description: e.target.value })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNewLesson({ ...newLesson, image: e.target.files[0] })
              }
            />

            <input
              type="number"
              placeholder="Order"
              value={newLesson.order}
              onChange={(e) =>
                setNewLesson({ ...newLesson, order: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleAddNew}>
                Save
              </button>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Learn;
