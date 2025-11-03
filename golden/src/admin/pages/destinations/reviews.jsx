import React, { useState } from "react";
import "./review.css";

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "John Doe",
      title: "Beautiful Experience in Italy",
      deal: "Summer Getaway",
      content: "Amazing trip! The food, culture, and scenery were unforgettable.",
      date: "2025-06-12",
    },
    {
      id: 2,
      name: "Emily Smith",
      title: "Adventure in Nepal",
      deal: "Himalayan Explorer",
      content: "Loved the trekking routes and the friendly people!",
      date: "2025-07-20",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    name: "",
    title: "",
    deal: "",
    content: "",
    date: "",
  });

  const openAddModal = () => {
    setCurrent({ id: null, name: "", title: "", deal: "", content: "", date: "" });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent(item);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (current.id) {
      setReviews((prev) => prev.map((r) => (r.id === current.id ? current : r)));
    } else {
      setReviews((prev) => [...prev, { ...current, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
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
            <th>Travel Deal</th>
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
              <td>{r.deal}</td>
              <td>{r.content}</td>
              <td>{r.date}</td>
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
              <input
                type="text"
                name="name"
                value={current.name}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Name</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="title"
                value={current.title}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label>Title</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="deal"
                value={current.deal}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Travel Deal</label>
            </div>

            <div className="form-group">
              <textarea
                name="content"
                value={current.content}
                onChange={handleChange}
                placeholder=" "
                required
              ></textarea>
              <label>Content</label>
            </div>

            <div className="form-group">
              <input
                type="date"
                name="date"
                value={current.date}
                onChange={handleChange}
                required
              />
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
