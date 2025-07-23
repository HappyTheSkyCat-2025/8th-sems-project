import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Download } from "lucide-react";

import "../styles/bookingDetail.css";

const BookingDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const paymentSuccess = queryParams.get("success") === "true";

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosInstance.get(`/payments/bookings/${id}/`);
        setBooking(response.data);
      } catch {
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleDownloadInvoice = async () => {
    try {
      const response = await axiosInstance.get(`/payments/bookings/${id}/download-invoice/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download invoice.");
    }
  };

  if (loading) return <div className="bd-loading">Loading booking details...</div>;
  if (error) return <div className="bd-alert bd-alert-error">{error}</div>;
  if (!booking) return <div className="bd-alert bd-alert-warning">Booking not found.</div>;

  const countrySlug = booking.travel_deal?.country?.slug?.toLowerCase() || "unknown";
  const dealSlug = booking.travel_deal?.slug || "unknown";

  return (
    <div className="bd-container">
      {paymentSuccess && (
        <div className="bd-alert bd-alert-success">
          <h4>Payment Successful!</h4>
          <p>Thank you for your booking. Here are your booking details.</p>
        </div>
      )}

      <div className="bd-card">
        {/* Title and View Travel Deal side by side */}
        <div className="bd-header">
          <h3 className="bd-title">{booking.travel_deal?.title || "Booking Details"}</h3>

          <Link
            to={`/destinations/${countrySlug}/deal/${dealSlug}`}
            target="_blank"
            className="bd-btn bd-btn-outline-info bd-btn-inline"
            rel="noopener noreferrer"
          >
            View Travel Deal
          </Link>
        </div>

        <section>
          <h5>Order Details</h5>
          <ul className="bd-list">
            <li><strong>Order ID:</strong> {booking.id}</li>
            <li><strong>Purchased:</strong> {new Date(booking.created_at).toLocaleDateString()}</li>
            <li><strong>Price Paid:</strong> {booking.payment_amount ? `$${booking.payment_amount}` : "N/A"}</li>
            <li>
              <strong>Status:</strong>{" "}
              <span className={`bd-badge ${booking.status === "confirmed" ? "bd-badge-success" : "bd-badge-warning"}`}>
                {booking.status}
              </span>
            </li>
            <li><strong>Payment Method:</strong> {booking.payment_method || "N/A"}</li>
            <li><strong>Payment Status:</strong> {booking.payment_status}</li>
            <li><strong>Transaction ID:</strong> {booking.transaction_id || "N/A"}</li>
            <li><strong>Payment Date:</strong> {booking.payment_date ? new Date(booking.payment_date).toLocaleString() : "N/A"}</li>
          </ul>
        </section>

        <section>
          <h5>Traveller Information</h5>
          <ul className="bd-list">
            <li><strong>Name:</strong> {booking.full_name}</li>
            <li><strong>Email:</strong> {booking.email}</li>
            <li><strong>Phone:</strong> {booking.phone}</li>
            <li><strong>Address Line 1:</strong> {booking.address_line1}</li>
            {booking.address_line2 && <li><strong>Address Line 2:</strong> {booking.address_line2}</li>}
            <li><strong>Town:</strong> {booking.town}</li>
            <li><strong>State:</strong> {booking.state}</li>
            <li><strong>Postcode:</strong> {booking.postcode}</li>
            <li><strong>Country:</strong> {booking.country}</li>
          </ul>
        </section>

        <section>
          <h5>Booking Details</h5>
          <ul className="bd-list">
            <li><strong>Number of Travellers:</strong> {booking.travellers}</li>
            <li><strong>Room Option:</strong> {booking.room_option}</li>
            <li><strong>Add Transfer:</strong> {booking.add_transfer ? "Yes" : "No"}</li>
            <li><strong>Add Nights:</strong> {booking.add_nights ? "Yes" : "No"}</li>
            <li><strong>Flight Help:</strong> {booking.flight_help ? "Yes" : "No"}</li>
            <li><strong>Donation:</strong> {booking.donation ? "Yes" : "No"}</li>
            <li>
              <strong>Travel Dates:</strong>{" "}
              {booking.date_option
                ? `${new Date(booking.date_option.start_date).toLocaleDateString()} - ${new Date(booking.date_option.end_date).toLocaleDateString()}`
                : "N/A"}
            </li>
          </ul>
        </section>

        <button className="bd-btn-primary" onClick={handleDownloadInvoice}>
          <Download size={16} className="bd-icon" />
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default BookingDetail;
