import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./bookin.css";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);

  // Fetch bookings from backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/bookings/");
      const data = (Array.isArray(res.data) ? res.data : res.data.results || []).map(
        (b) => ({
          id: b.id,
          name: b.full_name || `${b.user?.first_name} ${b.user?.last_name}` || "—",
          travellers: b.travellers || 0,
          room: b.room_option || "—",
          transfer: b.add_transfer ? "Yes" : "No",
          extraNight: b.add_nights ? "Yes" : "No",
          flightHelp: b.flight_help ? "Required" : "Not Required",
          donation: b.donation ? `$${b.donation}` : "$0",
        })
      );
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axiosInstance.delete(`/admin-dashboard/bookings/${id}/`);
      fetchBookings(); // refresh list
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const handleDetails = (booking) => setSelected(booking);
  const closeModal = () => setSelected(null);

  return (
    <div className="user-container">
      <h2 className="page-title">📘 Bookings</h2>
      <p className="page-desc">Manage and review all user booking information.</p>

      <div className="table-responsive">
        <table className="table align-middle custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>No. of Travellers</th>
              <th>Room</th>
              <th>Transfer</th>
              <th>Extra Night</th>
              <th>Flight Help</th>
              <th>Donation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length ? (
              bookings.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.travellers}</td>
                  <td>{item.room}</td>
                  <td>{item.transfer}</td>
                  <td>{item.extraNight}</td>
                  <td>{item.flightHelp}</td>
                  <td>{item.donation}</td>
                  <td>
                    <button
                      className="btn-details me-2"
                      onClick={() => handleDetails(item)}
                    >
                      Details
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>Booking Details</h4>
            <hr />
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>No. of Travellers:</strong> {selected.travellers}</p>
            <p><strong>Room:</strong> {selected.room}</p>
            <p><strong>Transfer:</strong> {selected.transfer}</p>
            <p><strong>Extra Night:</strong> {selected.extraNight}</p>
            <p><strong>Flight Help:</strong> {selected.flightHelp}</p>
            <p><strong>Donation:</strong> {selected.donation}</p>
            <button className="btn btn-primary mt-2" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
