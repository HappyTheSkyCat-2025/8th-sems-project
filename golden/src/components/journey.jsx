import React, { useState } from "react";
import "../styles/journey.css";
import { FaHeart } from "react-icons/fa";
import tripsData from "../data/journey";

export default function TripSection() {
  const tabs = Object.keys(tripsData);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [signatureRemoved, setSignatureRemoved] = useState(false);

  return (
    <section className="trip-section">
      <div className="trip-header-bar">
        <h2 className="section-label">EXCLUSIVE JOURNEYS</h2>
        <div className="trip-subheader">
          <div className="trip-tabs">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setSignatureRemoved(false);
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          <span className="explore-link">Explore all trips →</span>
        </div>
      </div>

      <div className="trip-card-grid">
        {tripsData[activeTab].map((trip, idx) => (
          <div
            key={trip.id}
            className="trip-card"
            style={{ backgroundImage: `url(${trip.image})` }}
          >
            <div className="trip-card-top">
              {trip.signature && idx === 0 && !signatureRemoved && (
                <div className="trip-badge-wrapper">
                  <div className="trip-badge">Signature Trip</div>
                </div>
              )}
              <div className="trip-card-top">
              <div className="trip-heart-circle">♡</div>
            </div>
            </div>

            <div className="trip-card-content">
              <h3 className="trip-title">{trip.title}</h3>
              <p className="trip-description">{trip.description}</p>
              <div className="trip-info-row">
                <span className="trip-duration">{trip.duration}</span>
              </div>
              <div className="trip-actions">
                <button className="details-btn">See Details</button>
                <div className="trip-price">{trip.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
