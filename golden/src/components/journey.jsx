import React, { useState } from "react";
import "../styles/journey.css";
import tripsData from "../data/journey";

export default function ExclusiveTrips() {
  const tabs = Object.keys(tripsData);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [signatureRemoved, setSignatureRemoved] = useState(false);

  return (
    <section className="exclusive-section">
      <div className="exclusive-header">
        <h2 className="exclusive-title">EXCLUSIVE JOURNEYS</h2>
        <div className="exclusive-subheader">
          <div className="exclusive-tabs">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`exclusive-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setSignatureRemoved(false);
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          <span className="exclusive-explore-link">Explore all trips →</span>
        </div>
      </div>

      <div className="exclusive-card-container">
        {tripsData[activeTab].map((trip, idx) => (
          <div
            key={trip.id}
            className="exclusive-card"
            style={{ backgroundImage: `url(${trip.image})` }}
          >
            <div className="exclusive-top">
              {trip.signature && idx === 0 && !signatureRemoved && (
                <div className="exclusive-badge-wrapper">
                  <div className="exclusive-badge">Signature Trip</div>
                </div>
              )}
              <div className="exclusive-heart">♡</div>
            </div>

            <div className="exclusive-content">
              <h3 className="exclusive-trip-title">{trip.title}</h3>
              <p className="exclusive-trip-desc">{trip.description}</p>
              <div className="exclusive-trip-days">{trip.duration}</div>
              <div className="exclusive-action-row">
                <button className="exclusive-details-btn">See Details</button>
                <div className="exclusive-price">
                  <span className="exclusive-original">{trip.originalPrice}</span>
                  <span className="exclusive-discounted">{trip.discountedPrice}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
