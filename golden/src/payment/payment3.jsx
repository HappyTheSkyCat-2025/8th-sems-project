import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCcVisa } from "react-icons/fa6";
import StepIndicator from "../components/StepIndicator";
import "./payment3.css";

export default function Payment3() {
  const navigate = useNavigate();
  const [showTrip, setShowTrip] = useState(false);
  const [showRooms, setShowRooms] = useState(false);

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
          <p>
            Please wait for confirmation before booking flights or non-refundable travel arrangements.
          </p>
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
          <label className="radio-option">
            <input type="radio" name="payment" defaultChecked /> Pay in full <strong>EUR€2,675.00</strong>
          </label>

          <h3 className="section-heading">Payment details</h3>
          <div className="card-logos">
            <FaCcVisa size={28} color="#1a1f71" />
            <span className="mastercard">Mastercard</span>
          </div>

          <form className="card-form">
            <label>
              Cardholder name
              <input type="text" placeholder="Cardholder name" />
            </label>
            <label>
              Card number
              <input type="text" placeholder="Card number" />
            </label>
            <div className="card-row">
              <label>
                Expiry date
                <input type="text" placeholder="MM/YY" />
              </label>
              <label>
                CVV/CVC
                <input type="text" placeholder="123" />
              </label>
            </div>
            <button type="button" className="promo-code-btn">I have a promo code</button>
          </form>

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
          <div className="trip-name">Classic Vietnam</div>
          <div className="duration">15 days</div>

          <div className="details">
            <p>
              <strong>Start</strong>
              <br />
              26 Jul 2025
              <br />
              Ho Chi Minh City, VIETNAM
            </p>
            <p>
              <strong>Finish</strong>
              <br />
              09 Aug 2025
              <br />
              Hanoi, VIETNAM
            </p>
          </div>

          {/* Dropdown trip */}
          <div className="summary-dropdown" onClick={() => setShowTrip(!showTrip)}>
            <span>Trip</span>
            <span>{showTrip ? "▲" : "▼"}</span>
          </div>
          {showTrip && <div className="dropdown-content">Trip amount: EUR €2,000.00</div>}

          <div className="summary-dropdown" onClick={() => setShowRooms(!showRooms)}>
            <span>Room options</span>
            <span>{showRooms ? "▲" : "▼"}</span>
          </div>
          {showRooms && <div className="dropdown-content">Private Room +675.00</div>}

          <div className="total breakdown">
            <div>Total</div>
            <div>EUR €2,675.00</div>
          </div>

          <div className="final-total pay-now">
            <span>Pay now</span>
            <strong>EUR €2,675.00</strong>
          </div>

          <div className="how-to-credit">
            <span title="How to redeem credit">ⓘ</span> How to redeem credit
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
        <button className="btn-back" onClick={() => navigate(-1)}>Back</button>
        <button className="btn-paynow">Pay Now</button>
      </div>

      <div className="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Booking conditions</a>
        <a href="#">Data collection notice</a>
      </div>
    </div>
  );
}
