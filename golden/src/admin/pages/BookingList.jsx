import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./booking.css";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const BOOKING_API = "admin-dashboard/bookings/";

  const fetchBookings = async (url = BOOKING_API) => {
    try {
      const res = await axiosInstance.get(url);
      setBookings(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      alert("Failed to fetch bookings. Are you logged in as admin?");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axiosInstance.delete(`${BOOKING_API}${id}/`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to delete booking", err);
      alert("Failed to delete booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="booking-container">
      <h2>Booking Management</h2>

      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Deal</th>
            <th>Date Option</th>
            <th>Travellers</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length ? (
            bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user}</td>
                <td>{b.full_name}</td>
                <td>{b.email}</td>
                <td>{b.travel_deal?.title || "-"}</td>
                <td>
                  {b.date_option
                    ? `${b.date_option.start_date} → ${b.date_option.end_date}`
                    : "-"}
                </td>
                <td>{b.travellers}</td>
                <td>{b.status}</td>
                <td>
                  {b.payment_status} ({b.payment_amount}{" "}
                  {b.travel_deal?.country?.currency_code || "USD"})
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {previous && <button onClick={() => fetchBookings(previous)}>← Previous</button>}
        {next && <button onClick={() => fetchBookings(next)}>Next →</button>}
      </div>
    </div>
  );
};

export default BookingList;
