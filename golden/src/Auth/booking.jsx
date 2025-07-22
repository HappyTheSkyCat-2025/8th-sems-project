import React from "react";
import "../styles/booking.css";
import bali from "../assets/bali.jpg";
import tokyo from "../assets/img2.jpg"; // Replace with another image if available
import { Download, RotateCcw } from "lucide-react";

const bookings = [
  {
    id: "ORD-12345",
    title: "Bali Paradise Retreat",
    date: "July 5, 2023",
    price: "$1,299",
    image: bali,
  },
  {
    id: "ORD-23456",
    title: "Tokyo City Explorer",
    date: "June 20, 2023",
    price: "$1,850",
    image: tokyo,
  },
];

const MyBookings = () => {
  return (
    <div className="my-bookings">
      <h2>My Bookings</h2>
      {bookings.map((booking, idx) => (
        <div className="booking-card" key={idx}>
          <div className="booking-img">
            <img src={booking.image} alt={booking.title} />
          </div>
          <div className="booking-info">
            <h3>{booking.title}</h3>
            <p className="order-id">
              Order ID: <span>{booking.id}</span>
            </p>
            <p className="purchase-date">🗓️ Purchased: <span>{booking.date}</span></p>
            <p className="booking-price">{booking.price}</p>
            <div className="booking-actions">
              <button className="download-btn"><Download size={16} /> Download Invoice</button>
              <button className="refund-btn"><RotateCcw size={16} /> Request Refund</button>
            </div>
          </div>
          <div className="booking-status">
            <span className="status confirmed">Confirmed</span>
            <button className="see-details-btn">
              See Details <span>→</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
