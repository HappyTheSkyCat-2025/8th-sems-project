import React, { useState } from "react";
import "./date.css";

const TravelDealDateList = () => {
  const [dealDates, setDealDates] = useState([
    {
      id: 1,
      deal: "Summer in Greece",
      startDate: "2025-06-10",
      endDate: "2025-06-20",
      language: "English",
      originalPrice: "1200",
      discountedPrice: "950",
      roomCapacity: "25",
    },
    {
      id: 2,
      deal: "Himalayan Trek",
      startDate: "2025-09-05",
      endDate: "2025-09-15",
      language: "English / Nepali",
      originalPrice: "1100",
      discountedPrice: "900",
      roomCapacity: "15",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    deal: "",
    startDate: "",
    endDate: "",
    language: "",
    originalPrice: "",
    discountedPrice: "",
    roomCapacity: "",
  });

  const openAddModal = () => {
    setCurrent({
      id: null,
      deal: "",
      startDate: "",
      endDate: "",
      language: "",
      originalPrice: "",
      discountedPrice: "",
      roomCapacity: "",
    });
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

  const saveDeal = () => {
    if (current.id) {
      setDealDates((prev) =>
        prev.map((d) => (d.id === current.id ? current : d))
      );
    } else {
      setDealDates((prev) => [
        ...prev,
        { ...current, id: Date.now() },
      ]);
    }
    closeModal();
  };

  const deleteDeal = (id) => {
    setDealDates((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="dealdate-container">
      <div className="dealdate-header">
        <h2>📅 Travel Deal Dates</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add Deal Date
        </button>
      </div>

      <p className="subtitle">
        Manage available dates, pricing, and capacity for each travel deal.
      </p>

      <div className="dealdate-grid">
        {dealDates.map((item) => (
          <div key={item.id} className="dealdate-card">
            <div className="dealdate-info">
              <h3>{item.deal}</h3>
              <p><strong>Start:</strong> {item.startDate}</p>
              <p><strong>End:</strong> {item.endDate}</p>
              <p><strong>Language:</strong> {item.language}</p>
              <p><strong>Original Price:</strong> ${item.originalPrice}</p>
              <p><strong>Discounted:</strong> ${item.discountedPrice}</p>
              <p><strong>Room Capacity:</strong> {item.roomCapacity}</p>
            </div>
            <div className="dealdate-actions">
              <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteDeal(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content scrollable" onClick={(e) => e.stopPropagation()}>
            <h3>{current.id ? "Edit Deal Date" : "Add Deal Date"}</h3>

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
              <input
                type="date"
                name="startDate"
                value={current.startDate}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Start Date</label>
            </div>

            <div className="form-group">
              <input
                type="date"
                name="endDate"
                value={current.endDate}
                onChange={handleChange}
                placeholder=" "
              />
              <label>End Date</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="language"
                value={current.language}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Language</label>
            </div>

            <div className="form-group">
              <input
                type="number"
                name="originalPrice"
                value={current.originalPrice}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Original Price</label>
            </div>

            <div className="form-group">
              <input
                type="number"
                name="discountedPrice"
                value={current.discountedPrice}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Discounted Price</label>
            </div>

            <div className="form-group">
              <input
                type="number"
                name="roomCapacity"
                value={current.roomCapacity}
                onChange={handleChange}
                placeholder=" "
              />
              <label>Room Capacity</label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveDeal}>Save</button>
              <button className="close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDealDateList;
