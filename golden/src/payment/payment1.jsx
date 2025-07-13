import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaInfo } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import StepIndicator from "../components/StepIndicator";
import "../payment/payment1.css";

export default function TravellerDetails() {
  const navigate = useNavigate();
  const [travellers, setTravellers] = useState(1);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showPrimaryModal, setShowPrimaryModal] = useState(false);
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();
    navigate("/payment/payment2");
  };

  const generateOptions = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const days = generateOptions(1, 31);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = generateOptions(1950, new Date().getFullYear());

  return (
    <div className="traveller-container">
      <StepIndicator current={0} />

      <div className="main-content">
        <div className="left-section">
          <h2>Traveller details</h2>
          {/* Late Request Box */}

          <div className="late-request-box">
            <div className="late-request-icon">
              <FaInfo size={14} />
            </div>
            <div className="late-request-content">
              <strong>Late request</strong>
              <p>
                For bookings close to departure date, full payment is required
                to request your place with our local operators. This usually
                takes 2 to 4 business days, but may take longer due to high
                demand.
              </p>
              <p>
               <br/> Please wait for confirmation before booking flights or
                non-refundable travel arrangements.
              </p>
            </div>
          </div>
          <div className="availability-box">
            <p>This departure is selling fast, only 3 places remaining.</p>
          </div>
          <div className="traveller-counter">
            <label>How many travellers?</label>
            <div className="counter-buttons">
              <button
                onClick={() => setTravellers(Math.max(1, travellers - 1))}
              >
                -
              </button>
              <span>{travellers}</span>
              <button onClick={() => setTravellers(travellers + 1)}>+</button>
            </div>
          </div>
          <h3 className="traveller-heading">
            <BsFillPersonFill /> 1. Primary traveller details
            <span
              className="info-icon"
              onClick={() => setShowPrimaryModal(true)}
            >
              ⓘ
            </span>
          </h3>
          <form className="form-box traveller-form" onSubmit={handleContinue}>
            <h4>Personal details</h4>

            <div className="title-group-modern">
              <div className="title-select-container">
                <label>Title *</label>
                <select required>
                  <option value="">Select</option>
                  <option>Mr</option>
                  <option>Ms</option>
                  <option>Mrs</option>
                </select>
              </div>
              <div className="title-info" onClick={() => setShowWhyModal(true)}>
                <FaInfo size={14} />
                <span>Why do we need this?</span>
              </div>
            </div>

            <input
              type="text"
              placeholder="First name (as per passport)*"
              required
            />
            <input type="text" placeholder="Middle name (as per passport)" />
            <input
              type="text"
              placeholder="Last name (as per passport)*"
              required
            />

            <label>Date of birth *</label>
            <div className="dob-group">
              <input list="days" placeholder="Day" required />
              <datalist id="days">
                {days.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
              <input list="months" placeholder="Month" required />
              <datalist id="months">
                {months.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <input list="years" placeholder="Year" required />
              <datalist id="years">
                {years.reverse().map((y) => (
                  <option key={y} value={y} />
                ))}
              </datalist>
            </div>

            <h4>Contact details</h4>
            <input type="email" placeholder="Email *" required />
            <input type="tel" placeholder="Contact number *" required />
            <input type="text" placeholder="Address line 1 *" required />
            <input type="text" placeholder="Address line 2" />
            <input type="text" placeholder="Suburb / Town *" required />
            <input type="text" placeholder="State / Province *" required />
            <input type="text" placeholder="Postcode / Zip *" required />
            <select required>
              <option value="">Country *</option>
              <option>Nepal</option>
              <option>India</option>
              <option>Vietnam</option>
            </select>

            {/* Deposit Section */}
            <div className="deposit-section">
              <h4>
                <span className="deposit-icon">💳</span> Deposit
              </h4>
              <p>
                Lock in your trip with a deposit if it departs 30+ days from
                now. Pay the rest as you like until full payment is due.
                Exceptions apply, so <a href="#">read booking conditions</a>.
              </p>
              <p className="privacy-text">
                Please see our <a href="#">Privacy and Collection notice</a>. By
                clicking "Continue" you agree we may contact you about your
                incomplete booking.
              </p>
              <button className="continue-button" type="submit">
                Continue →
              </button>
            </div>
          </form>
          <div className="footer-links">
            <span>Privacy</span>
            <span>Booking conditions</span>
            <span>Data collection notice</span>
          </div>
        </div>

        <div className="right-section">
          <div className="booking-summary">
            <h4>Booking summary</h4>
            <h3>Classic Vietnam</h3>
            <p>15 days</p>

            <div className="trip-dates">
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

            <div className="price-box">
              <div
                className="price-header"
                onClick={() => setShowTravellerDropdown(!showTravellerDropdown)}
              >
                <p>Trip</p>
                <p>
                  <FaChevronDown />
                </p>
              </div>
              {showTravellerDropdown && (
                <div className="dropdown-content">
                  <p>
                    Total for {travellers} traveller{travellers > 1 ? "s" : ""}:
                    EUR €{(2330 * travellers).toFixed(2)}
                  </p>
                </div>
              )}
              <hr />
              <h4>Total EUR €{(2330 * travellers).toFixed(2)}</h4>
            </div>

            <p className="credit-info" onClick={() => setShowCreditModal(true)}>
              ⓘ How to redeem credit
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWhyModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Why do we need this?</h4>
            <p>
              This helps us ensure names match official travel documents for
              booking accuracy.
            </p>
            <button onClick={() => setShowWhyModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showCreditModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>How to redeem credit</h4>
            <p>
              You can redeem travel credit on the payment page by selecting “Use
              Credit” before finalizing payment.
            </p>
            <button onClick={() => setShowCreditModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showPrimaryModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Primary Traveller Info</h4>
            <p>
              This information is required for processing your booking and
              travel documentation.
            </p>
            <button onClick={() => setShowPrimaryModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
