import React, { useEffect, useState } from "react";
import {
  getBookings,
  deleteBooking,
  createBooking,
  updateBooking,
  getBooking,
} from "../api/bookingApi";
import BookingForm from "../components/BookingForm";
import "./booking.css";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async (url = null) => {
    try {
      const res = await getBookings(url || undefined); // Pass null as undefined to default to base URL
      setBookings(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(id);
        fetchBookings(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete booking", err);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedBooking && selectedBooking.id) {
        await updateBooking(selectedBooking.id, data);
      } else {
        await createBooking(data);
      }
      setShowForm(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      console.error("Failed to save booking", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await getBooking(id);
      setSelectedBooking(res.data);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load booking", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Booking Management</h2>
      <button
        className="create-btn"
        onClick={() => {
          setSelectedBooking(null);
          setShowForm(true);
        }}
      >
        + Create Booking
      </button>

      <table className="booking-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Travellers</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user}</td>
              <td>{b.full_name}</td>
              <td>{b.email}</td>
              <td>{b.travellers}</td>
              <td>{b.status}</td>
              <td>{b.payment_status}</td>
              <td>
                <button onClick={() => handleEdit(b.id)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="delete-btn"
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
          <button onClick={() => fetchBookings(previous)}>← Previous</button>
        )}
        {next && <button onClick={() => fetchBookings(next)}>Next →</button>}
      </div>

      {showForm && (
        <BookingForm
          booking={selectedBooking}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default BookingList;
