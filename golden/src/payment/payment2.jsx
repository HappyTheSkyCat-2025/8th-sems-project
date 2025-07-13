import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../components/StepIndicator";
import "./payment2.css";

export default function Payment2() {
  const navigate = useNavigate();
  const [showLateModal, setShowLateModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  return (
    <div className="payment-container">
      <StepIndicator current={1} />
      <h2 className="trip-title">Trip extras</h2>

      <div className="payment-grid">
        {/* LEFT SIDE */}
        <div className="left-column">
          <div
            className="notice-box late-request"
            onClick={() => setShowLateModal(true)}
          >
            <div className="icon">i</div>
            <div className="notice-content">
              <strong>Late request</strong>
              <p>
                For bookings close to departure date, full payment is required
                to request your place with our local operators. This usually
                takes 2 - 4 business days, but may take longer due to high
                demand.
              </p>
              <p>
                Please wait for confirmation before booking flights or
                non-refundable travel arrangements.
              </p>
            </div>
          </div>

          <div className="notice-box selling-fast">
            <div className="icon">i</div>
            <div className="notice-content">
              This departure is selling fast, only <strong>3 places</strong>{" "}
              remaining.
            </div>
          </div>

          <div className="room-options">
            <h3>Room options</h3>
            <p>Want to change your room?</p>
            <p>
              Individual rooms are subject to availability. We’ll be in touch in
              2 - 4 business days with an update.
            </p>
            <form>
              <label>
                <input type="radio" name="room" />
                <span className="room-option">
                  Individual room <span className="price">+ EUR €345.00</span>
                </span>
              </label>
              <label>
                <input type="radio" name="room" />
                <span className="room-option">
                  Share with a friend on another booking{" "}
                  <span className="price">(No additional cost)</span>
                </span>
              </label>
            </form>
          </div>

          <div className="prepost-section">
            <h3>Pre & post-trip extras</h3>
            <div className="prepost-info">
              <strong>Complimentary transfer</strong>
              <p>
                You're entitled to a complimentary arrival transfer. Don’t
                forget to add it to your booking.
              </p>
            </div>
            <button className="extras-btn">🚌 Add transfers</button>
            <button className="extras-btn">🏨 Add extra nights</button>
          </div>

          <div className="additional-services">
            <h3>Additional services</h3>
            <p>We can help you book flights.</p>
            <label>
              <input type="checkbox" /> Contact me about flights
            </label>
            <p className="small">
              We’ll be in touch in 2 - 4 business days after we receive your
              request to discuss how we can help.
            </p>
          </div>

          <div className="donation-box">
            <h3>Would you like to support the communities we visit?</h3>
            <p>
              Donate 1% of your trip cost to the Intrepid Foundation to support
              life-changing projects empowering local people.
            </p>
            <p>
              100% of your donation goes to local organisations creating
              positive change for people and the planet.
            </p>
            <label>
              <input type="checkbox" /> Yes, add EUR €23.00 to help local
              communities
            </label>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-column">
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
            <div className="total">
              <span>Trip</span>
              <span>
                Total: <strong>EUR €2,330.00</strong>
              </span>
            </div>
            <div
              className="how-to-credit"
              onClick={() => setShowCreditModal(true)}
            >
              ⓘ How to redeem credit
            </div>
          </div>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <button
          className="continue-btn"
          onClick={() => navigate("/payment/payment3")}
        >
          Continue →
        </button>
      </div>

      {/* Footer Links */}
      <footer className="footer-links">
        <span>Privacy</span>
        <span>Booking conditions</span>
        <span>Data collection notice</span>
      </footer>

      {/* Modals */}
      {showLateModal && (
        <div className="modal" onClick={() => setShowLateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>Late request</h4>
            <p>
              For bookings close to departure date, full payment is required to
              request your place with our local operators. This usually takes 2
              - 4 business days, but may take longer due to high demand.
            </p>
            <p>
              Please wait for confirmation before booking flights or
              non-refundable travel arrangements.
            </p>
            <button onClick={() => setShowLateModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showCreditModal && (
        <div className="modal" onClick={() => setShowCreditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h4>How to redeem credit</h4>
            <p>
              You can redeem travel credit on the payment page by selecting “Use
              Credit” before finalizing payment.
            </p>
            <button onClick={() => setShowCreditModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
