import React, { useState, useEffect } from "react";
import {
  createTravelDealDate,
  updateTravelDealDate,
} from "../api/travelDealDateApi";
import { getTravelDeals } from "../api/travelDealApi";

export default function TravelDealDateForm({ travelDealDate, onClose, onSave }) {
  const [travelDealId, setTravelDealId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelDeals, setTravelDeals] = useState([]);

  useEffect(() => {
    getTravelDeals().then((res) => setTravelDeals(res.data.results));
  }, []);

  useEffect(() => {
    if (travelDealDate) {
      setTravelDealId(travelDealDate.travel_deal?.id || "");
      setStartDate(travelDealDate.start_date || "");
      setEndDate(travelDealDate.end_date || "");
    } else {
      setTravelDealId("");
      setStartDate("");
      setEndDate("");
    }
  }, [travelDealDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      travel_deal: travelDealId,
      start_date: startDate,
      end_date: endDate,
    };
    try {
      if (travelDealDate) {
        await updateTravelDealDate(travelDealDate.id, data);
      } else {
        await createTravelDealDate(data);
      }
      onSave();
    } catch (err) {
      console.error("Failed to save travel deal date", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{travelDealDate ? "Edit Travel Deal Date" : "Add Travel Deal Date"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Travel Deal:
            <select
              value={travelDealId}
              onChange={(e) => setTravelDealId(e.target.value)}
              required
            >
              <option value="" disabled>Select Travel Deal</option>
              {travelDeals.map((td) => (
                <option key={td.id} value={td.id}>{td.title}</option>
              ))}
            </select>
          </label>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
          <div className="form-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
