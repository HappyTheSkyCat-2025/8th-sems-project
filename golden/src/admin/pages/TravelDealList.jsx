import React, { useEffect, useState } from "react";
import {
  getTravelDeals,
  deleteTravelDeal,
} from "../api/travelDealApi";
import TravelDealForm from "../components/TravelDealForm";
import "./travelDeal.css";

const TravelDealList = () => {
  const [deals, setDeals] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const fetchDeals = async (url = null) => {
    try {
      const res = await getTravelDeals(url || undefined);
      setDeals(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch deals", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this travel deal?")) {
      try {
        await deleteTravelDeal(id);
        fetchDeals();
      } catch (err) {
        console.error("Failed to delete deal", err);
      }
    }
  };

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedDeal(null);
    fetchDeals();
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <div>
      <h2>Travel Deals</h2>
      <button
        className="create-btn"
        onClick={() => {
          setSelectedDeal(null);
          setShowForm(true);
        }}
      >
        + Create Travel Deal
      </button>

      <table className="traveldeal-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Country</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.title}</td>
              <td>{d.country?.name || "-"}</td>
              <td>{d.category?.name || "-"}</td>
              <td>{d.price}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(d)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(d.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {previous && (
          <button onClick={() => fetchDeals(previous)}>← Previous</button>
        )}
        {next && <button onClick={() => fetchDeals(next)}>Next →</button>}
      </div>

      {showForm && (
        <TravelDealForm
          travelDeal={selectedDeal}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default TravelDealList;
