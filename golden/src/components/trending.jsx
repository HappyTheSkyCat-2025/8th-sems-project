import React from "react";
import "../styles/trending.css";
import trending from "../data/trending";
import { IoIosArrowForward } from "react-icons/io";

export default function Trending() {
  return (
    <section className="trending-section">
      <h2 className="trending-title">Trending Group Tours</h2>
      <div className="underline gold" />
      <p className="trending-subtitle">
        Discover our carefully selected destinations that promise unforgettable
        experiences and breathtaking landscapes.
      </p>

      <div className="trip-card-grid">
        {trending.map((trip, index) => (
          <div
            key={trip.id}
            className="trip-card"
            style={{ backgroundImage: `url(${trip.image})` }}
          >
            {index === 0 && (
              <div className="ribbon">
                <span>Signature Trip</span>
              </div> 
            )}

            <div className="trip-overlay" />

            <div className="trip-card-top">
              <div className="trip-heart-circle">♡</div>
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

      <div className="view-all-btn-wrapper">
        <button className="view-all-btn">
          View All Destinations <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
}
