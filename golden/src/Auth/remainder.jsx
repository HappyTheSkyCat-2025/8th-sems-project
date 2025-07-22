import React, { useState } from "react";
import "../styles/reamainder.css";
import bali from "../assets/bali.jpg";
import { CalendarDays, Clock } from "lucide-react";

export default function Reminders() {
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <div className="reminder-wrapper">
      <h2>Reminders & Upcoming Trips</h2>
      <p className="subtext">Your Next Adventure</p>

      <div className="reminder-card">
        <div className="reminder-img">
          <img src={bali} alt="Bali Paradise Retreat" />
        </div>
        <div className="reminder-info">
          <h3>Bali Paradise Retreat</h3>
          <p className="reminder-dates">
            <CalendarDays size={16} /> Aug 15 - Aug 22, 2023
          </p>
          <div className="reminder-countdown">
            <Clock size={16} />
            <span>5 days left until your trip!</span>
          </div>
        </div>
        <div className="reminder-actions">
          <button className="see-details-btn">
            See Details <span>→</span>
          </button>
        </div>
      </div>

      <div className="email-reminder">
        <h4>Travel Reminder</h4>
        <div className="email-toggle">
          <div>
            <strong>Email Notifications</strong>
            <p>Receive trip reminders via email</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
}
