import React, { useEffect, useState } from "react";
import {
  getTravelDealDates,
  deleteTravelDealDate,
} from "../api/travelDealDateApi";
import TravelDealDateForm from "../components/TravelDealDateForm";
import "./travelDealDate.css";

const TravelDealDateList = () => {
  const [dates, setDates] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchDates = async (url = null) => {
    try {
      const res = await getTravelDealDates(url || undefined);
      setDates(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch travel deal dates", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this date?")) {
      try {
        await deleteTravelDealDate(id);
        fetchDates();
      } catch (err) {
        console.error("Failed to delete travel deal date", err);
      }
    }
  };

  const handleEdit = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedDate(null);
    fetchDates();
  };

  useEffect(() => {
    fetchDates();
  }, []);

  return (
    <div>
      <h2>Travel Deal Dates</h2>
      <button
        className="create-btn"
        onClick={() => {
          setSelectedDate(null);
          setShowForm(true);
        }}
      >
        + Add Travel Deal Date
      </button>

      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Travel Deal</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.travel_deal_title || "-"}</td>
              <td>{d.start_date}</td>
              <td>{d.end_date}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(d)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(d.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {previous && (
          <button onClick={() => fetchDates(previous)}>← Previous</button>
        )}
        {next && <button onClick={() => fetchDates(next)}>Next →</button>}
      </div>

      {showForm && (
        <TravelDealDateForm
          travelDealDate={selectedDate}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TravelDealDateList;
