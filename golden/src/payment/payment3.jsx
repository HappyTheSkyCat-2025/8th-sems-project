import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { SiPaypal, SiCashapp, SiStripe } from "react-icons/si";
import "react-toastify/dist/ReactToastify.css";

import StepIndicator from "../components/StepIndicator";
import StripePayment from "./StripePayment";
import PayPalPayment from "./PayPalPayment";
import axiosInstance from "../utils/axiosInstance";
import "./payment3.css";

export default function Payment3() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  // Extras from navigation state (camelCase keys)
  const extras = location.state?.extras || {};
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showTrip, setShowTrip] = useState(false);
  const [showRooms, setShowRooms] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await axiosInstance.get(`/payments/bookings/${id}/`);
        setBooking(res.data);
      } catch (err) {
        setError("Failed to load booking.");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!booking) return <div>No booking found.</div>;

  const { travel_deal = {}, date_option = {} } = booking;

  // Calculate costs based on extras (camelCase)
  const tripCost = parseFloat(date_option.discounted_price) || 0;
  const roomCost = extras.roomOption === "private" ? 345 : 0;
  const donationCost = extras.donation ? 23 : 0;
  const amount = (tripCost + roomCost + donationCost).toFixed(2);

  // === CALLBACKS ===
  const handleManualPayment = async () => {
    setPaying(true);
    try {
      await axiosInstance.put(
        `/payments/bookings/${id}/update-payment/`,
        {
          payment_method: "manual",
          payment_amount: amount,
          transaction_id: null,
        }
      );
      toast.success("Cash payment confirmed!");
      setTimeout(() => navigate(`/bookings/${id}?success=true`), 1500); // Redirect with success param
    } catch (err) {
      toast.error("Payment failed: " + (err.response?.data?.detail || "Unknown error"));
    } finally {
      setPaying(false);
    }
  };

  const onStripeSuccess = async (chargeId) => {
    try {
      await axiosInstance.put(
        `/payments/bookings/${id}/update-payment/`,
        {
          payment_method: "stripe",
          payment_amount: amount,
          transaction_id: chargeId,
        }
      );
      toast.success("Stripe payment confirmed!");
      setTimeout(() => navigate(`/bookings/${id}?success=true`), 1500); // Redirect with success param
    } catch (err) {
      toast.error("Stripe update failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  const onPayPalSuccess = async (paypalTransactionId) => {
    try {
      await axiosInstance.put(
        `/payments/bookings/${id}/update-payment/`,
        {
          payment_method: "paypal",
          payment_amount: amount,
          transaction_id: paypalTransactionId,
        }
      );
      toast.success("PayPal payment confirmed!");
      setTimeout(() => navigate(`/bookings/${id}?success=true`), 1500); // Redirect with success param
    } catch (err) {
      toast.error("PayPal update failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  const paymentOptions = [
    { id: "cash", label: "Cash", icon: <SiCashapp size={28} /> },
    { id: "paypal", label: "PayPal", icon: <SiPaypal size={28} /> },
    { id: "stripe", label: "Stripe", icon: <SiStripe size={28} /> },
  ];

  return (
    <div className="payment3-container">
      <StepIndicator current={2} />
      <h2 className="payment-title">Payment</h2>

      {/* Late request alert */}
      <div className="notice-box">
        <div className="notice-icon">i</div>
        <div className="notice-text">
          <strong>Late request</strong>
          <p>
            For bookings close to departure date, full payment is required to request your place with our local
            operators. This usually takes 2 to 4 business days, but may take longer due to high demand.
          </p>
          <p>Please wait for confirmation before booking flights or non-refundable travel arrangements.</p>
        </div>
      </div>

      <div className="payment-main">
        {/* LEFT */}
        <div className="payment-left">
          <div className="review-box">
            Have you reviewed the details in the booking summary? If something isn’t correct, you can adjust your
            details in the previous steps.
          </div>

          <h3 className="section-heading">Payment options</h3>
          {paymentOptions.map((opt) => (
            <button
              key={opt.id}
              className={`payment-option-btn ${paymentMethod === opt.id ? "selected" : ""}`}
              onClick={() => setPaymentMethod(opt.id)}
            >
              {opt.icon} {opt.label}
            </button>
          ))}

          <h3 className="section-heading">Payment details</h3>
          {paymentMethod === "cash" && (
            <>
              <p>Please pay cash on arrival.</p>
              <button
                className="btn btn-success w-100 mt-2"
                onClick={handleManualPayment}
                disabled={paying}
              >
                {paying ? "Processing..." : "Confirm Cash Payment"}
              </button>
            </>
          )}

          {paymentMethod === "stripe" && (
            <StripePayment
              amount={amount}
              onSuccess={onStripeSuccess}
              onError={(msg) => toast.error(msg)}
            />
          )}

          {paymentMethod === "paypal" && (
            <PayPalPayment
              amount={amount}
              onSuccess={onPayPalSuccess}
              onError={(msg) => toast.error(msg)}
            />
          )}

          {/* Agreements */}
          <div className="checkboxes">
            <label>
              <input type="checkbox" /> I agree to the <a href="#">terms and conditions</a> and
              <a href="#"> privacy policy</a> <span className="required">*</span>
            </label>
            <label>
              <input type="checkbox" /> I have read the <a href="#">Essential Trip Information</a> and will follow
              <a href="#"> community guidelines</a> <span className="required">*</span>
            </label>
            <label>
              <input type="checkbox" /> I would like to receive offers and regular updates from Intrepid Travel via email
            </label>
          </div>
        </div>

        {/* RIGHT */}
        <div className="booking-summary">
          <h3>Booking summary</h3>
          <div className="trip-name">{travel_deal.title || "Trip Name"}</div>
          <div className="duration">{travel_deal.days ? `${travel_deal.days} days` : ""}</div>

          <div className="details">
            <p>
              <strong>Start</strong>
              <br />
              {date_option.start_date
                ? new Date(date_option.start_date).toLocaleDateString()
                : "N/A"}{" "}
              <br />
              {travel_deal.start_location || ""}
            </p>
            <p>
              <strong>Finish</strong>
              <br />
              {date_option.end_date
                ? new Date(date_option.end_date).toLocaleDateString()
                : "N/A"}{" "}
              <br />
              {travel_deal.end_location || ""}
            </p>
          </div>

          <div className="summary-dropdown" onClick={() => setShowTrip(!showTrip)}>
            <span>Trip</span>
            <span>{showTrip ? "▲" : "▼"}</span>
          </div>
          {showTrip && <div className="dropdown-content">Trip amount: EUR €{tripCost.toFixed(2)}</div>}

          <div className="summary-dropdown" onClick={() => setShowRooms(!showRooms)}>
            <span>Room options</span>
            <span>{showRooms ? "▲" : "▼"}</span>
          </div>
          {showRooms && extras.roomOption === "private" && (
            <div className="dropdown-content">Private Room +345.00</div>
          )}

          <div className="total breakdown">
            <div>Total</div>
            <div>EUR €{amount}</div>
          </div>

          <div className="final-total pay-now">
            <span>Pay now</span>
            <strong>EUR €{amount}</strong>
          </div>

          <div className="how-to-credit" title="How to redeem credit">
            <span>ⓘ</span> How to redeem credit
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="info-boxes">
        <div>
          <strong>💳 Paying deposit?</strong>
          <p>Pay the rest of your payments later as you like. We’ll remind you before full payment is due.</p>
        </div>
        <div>
          <strong>🔒 Lock in your price</strong>
          <p>Once you’ve booked your trip, the price will be locked in.</p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="form-actions">
        <button className="btn-back" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      <div className="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Booking conditions</a>
        <a href="#">Data collection notice</a>
      </div>
    </div>
  );
}
