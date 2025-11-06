import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./date.css";

const TravelDealDateList = () => {
  const [dealDates, setDealDates] = useState([]);
  const [travelDeals, setTravelDeals] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    travel_deal: "",
    start_date: "",
    end_date: "",
  });

  // Fetch deal dates + travel deals
  useEffect(() => {
    fetchTravelDeals();
    fetchDealDates();
  }, []);

  const fetchTravelDeals = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/travel-deals/");
      setTravelDeals(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (error) {
      console.error("Failed to load travel deals:", error);
      setTravelDeals([]);
    }
  };

  const fetchDealDates = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/travel-deal-dates/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setDealDates(data);
    } catch (error) {
      console.error("Failed to load deal dates:", error);
      setDealDates([]);
    }
  };

  const openAddModal = () => {
    setCurrent({ id: null, travel_deal: "", start_date: "", end_date: "" });
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

  const saveDealDate = async () => {
    try {
      if (!current.travel_deal || !current.start_date || !current.end_date) {
        alert("Please fill all fields!");
        return;
      }

      if (current.id) {
        await axiosInstance.put(
          `/admin-dashboard/travel-deal-dates/${current.id}/`,
          current
        );
      } else {
        await axiosInstance.post("/admin-dashboard/travel-deal-dates/", current);
      }

      closeModal();
      fetchDealDates();
    } catch (error) {
      console.error("Failed to save deal date:", error.response?.data || error);
    }
  };

  const deleteDealDate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal date?")) return;
    try {
      await axiosInstance.delete(`/admin-dashboard/travel-deal-dates/${id}/`);
      fetchDealDates();
    } catch (error) {
      console.error("Failed to delete deal date:", error);
    }
  };

  return (
    <div className="dealdate-container">
      <div className="dealdate-header">
        <h2>📅 Travel Deal Dates</h2>
        <button className="add-btn" onClick={openAddModal}>+ Add Deal Date</button>
      </div>

      <p className="subtitle">
        Manage available dates for each travel deal.
      </p>

      <div className="dealdate-grid">
        {Array.isArray(dealDates) && dealDates.map((item) => (
          <div key={item.id} className="dealdate-card">
            <div className="dealdate-info">
              <h3>{item.travel_deal_title || "—"}</h3>
              <p><strong>Start:</strong> {item.start_date}</p>
              <p><strong>End:</strong> {item.end_date}</p>
            </div>
            <div className="dealdate-actions">
              <button className="edit-btn" onClick={() => openEditModal(item)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteDealDate(item.id)}>Delete</button>
            </div>
          </div>
        ))}
        {!Array.isArray(dealDates) || dealDates.length === 0 && (
          <p>No deal dates found.</p>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content scrollable" onClick={(e) => e.stopPropagation()}>
            <h3>{current.id ? "Edit Deal Date" : "Add Deal Date"}</h3>

            <div className="form-group">
              <select name="travel_deal" value={current.travel_deal} onChange={handleChange}>
                <option value="">Select Travel Deal</option>
                {travelDeals.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
              <label>Travel Deal</label>
            </div>

            <div className="form-group">
              <input
                type="date"
                name="start_date"
                value={current.start_date}
                onChange={handleChange}
              />
              <label>Start Date</label>
            </div>

            <div className="form-group">
              <input
                type="date"
                name="end_date"
                value={current.end_date}
                onChange={handleChange}
              />
              <label>End Date</label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={saveDealDate}>Save</button>
              <button className="close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelDealDateList;
