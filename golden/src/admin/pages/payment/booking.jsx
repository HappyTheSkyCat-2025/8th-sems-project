import React, { useState } from "react";
import "./bookin.css";

const Booking = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      name: "Dipesh Thapa",
      travellers: 2,
      room: "Private",
      transfer: "Yes",
      extraNight: "No",
      flightHelp: "Required",
      donation: "$20",
    },
    {
      id: 2,
      name: "Sita Gurung",
      travellers: 4,
      room: "Shared",
      transfer: "No",
      extraNight: "Yes",
      flightHelp: "Not Required",
      donation: "$10",
    },
  ]);

  const [selected, setSelected] = useState(null);

  const handleDelete = (id) => setBookings(bookings.filter((b) => b.id !== id));
  const handleDetails = (booking) => setSelected(booking);
  const closeModal = () => setSelected(null);

  return (
    <div className="user-container">
      <h2 className="page-title">📘 Bookings</h2>
      <p className="page-desc">
        Manage and review all user booking information.
      </p>

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
            {bookings.map((item) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>Booking Details</h4>
            <hr />
            <p>
              <strong>Name:</strong> {selected.name}
            </p>
            <p>
              <strong>No. of Travellers:</strong> {selected.travellers}
            </p>
            <p>
              <strong>Room:</strong> {selected.room}
            </p>
            <p>
              <strong>Transfer:</strong> {selected.transfer}
            </p>
            <p>
              <strong>Extra Night:</strong> {selected.extraNight}
            </p>
            <p>
              <strong>Flight Help:</strong> {selected.flightHelp}
            </p>
            <p>
              <strong>Donation:</strong> {selected.donation}
            </p>
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
