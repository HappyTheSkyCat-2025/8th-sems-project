import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance"; // your axios setup
import "./review.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    name: "",
    title: "",
    rating: "",
    content: "",
    travel_date: "",
  });

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/reviews/");
      const data = Array.isArray(res.data) ? res.data : res.data.results;
      setReviews(data || []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    }
  };

  const openAddModal = () => {
    setCurrent({ id: null, name: "", title: "", rating: "", content: "", travel_date: "" });
    setModalOpen(true);
  };

  const openEditModal = (review) => {
    setCurrent({
      id: review.id,
      name: review.name,
      title: review.title,
      rating: review.rating,
      content: review.content,
      travel_date: review.travel_date,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (current.id) {
        await axiosInstance.put(`/admin-dashboard/reviews/${current.id}/`, current);
      } else {
        await axiosInstance.post("/admin-dashboard/reviews/", current);
      }
      setModalOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("Failed to save review:", error.response?.data || error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axiosInstance.delete(`/admin-dashboard/reviews/${id}/`);
      fetchReviews();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <div className="review-container">
      <div className="review-header">
        <h2>⭐ Reviews</h2>
        <button className="add-btn" onClick={openAddModal}>+ Add Review</button>
      </div>
      <p>Moderate traveler reviews and feedback on destinations.</p>

      <table className="review-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Rating</th>
            <th>Content</th>
            <th>Travel Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.title}</td>
              <td>{r.rating}</td>
              <td>{r.content}</td>
              <td>{r.travel_date}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(r)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{current.id ? "Edit Review" : "Add Review"}</h3>

            <div className="form-group">
              <input type="text" name="name" value={current.name} onChange={handleChange} placeholder=" " required />
              <label>Name</label>
            </div>

            <div className="form-group">
              <input type="text" name="title" value={current.title} onChange={handleChange} placeholder=" " required />
              <label>Title</label>
            </div>

            <div className="form-group">
              <input type="number" name="rating" value={current.rating} onChange={handleChange} placeholder=" " min="1" max="5" />
              <label>Rating (1-5)</label>
            </div>

            <div className="form-group">
              <textarea name="content" value={current.content} onChange={handleChange} placeholder=" " required />
              <label>Content</label>
            </div>

            <div className="form-group">
              <input type="date" name="travel_date" value={current.travel_date} onChange={handleChange} required />
              <label className="date-label">Travel Date</label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
