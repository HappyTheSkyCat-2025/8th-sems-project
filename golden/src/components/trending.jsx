import React, { useState } from "react";
import "../styles/trending.css";
import trending from "../data/trending";
import { IoIosArrowForward } from "react-icons/io";

export default function TrendingTours() {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <section className="trend-section">
      <h2 className="trend-title">Trending Group Tours</h2>
      <div className="trend-underline" />
      <p className="trend-subtitle">
        Discover our carefully selected destinations that promise unforgettable
        experiences and breathtaking landscapes.
      </p>

      <div className="trend-card-container">
        {trending.map((trip, index) => (
          <div
            key={trip.id + index}
            className="trend-card"
            style={{ backgroundImage: `url(${trip.image})` }}
          >
            {index === 0 && (
              <div className="trend-badge-wrapper">
                <div className="trend-badge">Signature Trip</div>
              </div>
            )}

            <div className="trend-card-top">
              <div
                className={`trend-heart ${favorites.includes(trip.id) ? "active" : ""}`}
                onClick={() => toggleFavorite(trip.id)}
              >
                {favorites.includes(trip.id) ? "♡" : "♡"}
              </div>
            </div>

            <div className="trend-content">
              <h3 className="trend-trip-title">{trip.title}</h3>
              <p className="trend-trip-desc">{trip.description}</p>
              <div className="trend-trip-days">{trip.duration}</div>
              <div className="trend-action-row">
                <button className="trend-details-btn">See Details</button>
                <div className="trend-price-row">
                  <span className="trend-original">$1,499</span>
                  <span className="trend-discounted">{trip.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="trend-btn-wrapper">
        <button className="trend-view-btn">
          View All Destinations <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
}
