import React from "react";
import StepIndicator from "../components/StepIndicator";
import "./payment3.css";

export default function Payment3() {
  return (
    <div className="payment3-container">
      {/* ───── Step bar ───── */}
      <StepIndicator current={2} />

      <h2 className="payment-title">Payment</h2>

      {/* ---- notice ---- */}
      <div className="notice-box late-request">
        <div className="icon">i</div>
        <div className="notice-content">
          <strong>Late request</strong>
          <p>
            For bookings close to departure date, full payment is required to request
            your place with our local operators. This usually takes 2 – 4 business
            days, but may take longer due to high demand.
          </p>
          <p>Please wait for confirmation before booking flights or non‑refundable travel arrangements.</p>
        </div>
      </div>

      {/* ---- two‑column layout ---- */}
      <div className="payment-main">
        {/* LEFT: card form */}
        <div className="payment-left">
          <div className="review-box">
            <p>
              Have you reviewed the details in the booking summary? If something isn’t
              correct, you can adjust your details in the previous steps.
            </p>
          </div>

          <h3 className="subheading">Payment options</h3>
          <label className="radio-option">
            <input type="radio" name="payment" defaultChecked /> Pay in full{" "}
            <strong>EUR €2 675.00</strong>
          </label>

          <h3 className="subheading">Payment details</h3>
          <div className="card-logos">
            VISA <span className="dot"></span> MASTERCARD
          </div>

          {/* ==== Card form ==== */}
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

            <button type="button" className="promo-code-btn">
              I have a promo code
            </button>

            {/* checkboxes */}
            <div className="checkboxes">
              <label>
                <input type="checkbox" /> I agree to the{" "}
                <a href="#">terms and conditions</a> and <a href="#">privacy policy</a> *
              </label>
              <label>
                <input type="checkbox" /> I have read the{" "}
                <a href="#">Essential Trip Information</a> and will follow{" "}
                <a href="#">community guidelines</a> *
              </label>
              <label>
                <input type="checkbox" /> I would like to receive offers and regular
                updates from Intrepid Travel via email
              </label>
            </div>
          </form>
        </div>

        {/* RIGHT: booking summary */}
        <div className="booking-summary">
          <h3>Booking summary</h3>
          <div className="trip-name">Classic Vietnam</div>
          <div className="duration">15 days</div>

          <div className="details">
            <p>
              <strong>Start</strong>
              <br />
              26 Jul 2025
              <br />
              Ho Chi Minh City, VIETNAM
            </p>
            <p>
              <strong>Finish</strong>
              <br />
              09 Aug 2025
              <br />
              Hanoi, VIETNAM
            </p>
          </div>

          <div className="total breakdown">
            <div>Trip</div>
            <div>Room options</div>
          </div>

          <div className="final-total">
            <span>Total</span>
            <strong>EUR €2 675.00</strong>
          </div>

          <div className="final-total pay-now">
            <span>Pay now</span>
            <strong>EUR €2 675.00</strong>
          </div>

          <div className="how-to-credit">ⓘ How to redeem credit</div>
        </div>
      </div>

      {/* ---- info boxes ---- */}
      <div className="info-boxes">
        <div>
          <strong>💳 Paying deposit?</strong>
          <p>
            Pay the rest of your payments later as you like. We’ll remind you 7 days
            before full payment is due to avoid cancellation.
          </p>
          <p>
            If you change your mind, you can cancel up to 30 days before departure and
            we’ll charge your deposit as a cancellation fee and refund any additional
            payments made. Exceptions apply, so{" "}
            <a href="#">read booking conditions</a>.
          </p>
        </div>
        <div>
          <strong>🔒 Lock in your price</strong>
          <p>Once you’ve booked your trip, the price will be locked in.</p>
          <p>
            Our prices can change anytime due to demand, market conditions and
            availability. If you choose to cancel and rebook at a different price, full
            cancellation conditions will apply. Exceptions apply, so{" "}
            <a href="#">read booking conditions</a>.
          </p>
        </div>
      </div>

      {/* ---- actions ---- */}
      <div className="form-actions">
        <button className="btn-back">Back</button>
        <button className="btn-paynow">Pay Now</button>
      </div>

      <div className="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Booking conditions</a>
        <a href="#">Data collection notice</a>
      </div>
    </div>
  );
}
