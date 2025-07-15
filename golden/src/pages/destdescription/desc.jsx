import React from "react";
import {
  FaStar,
  FaUserFriends,
  FaMapSigns,
  FaGlobe,
  FaUsers,
  FaLanguage,
  FaFileDownload,
  FaPhoneAlt,
} from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import "../../pagescss/desc.css";

export default function Desc({ data, onViewDatesClick }) {
  const rating = data.average_rating || 0;

  const renderStars = (rating) => {
    const filledStars = Math.round(rating);
    return (
      <>
        {[...Array(5)].map((_, i) =>
          i < filledStars ? (
            <FaStar key={i} className="star filled" />
          ) : (
            <FaStar key={i} className="star empty" />
          )
        )}
      </>
    );
  };

  // Scroll to review section
  const scrollToReviewSection = () => {
    const reviewSection = document.getElementById("review-section");
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="trip-section">
      <div className="trip-header">
        <h1>{data.title}</h1>
        <p>
          <strong>{data.days} days</strong> · {renderStars(rating)}{" "}
          <span className="review-count">
            {rating} ({data.review_count || 0} reviews)
          </span>{" "}
          · {data.country?.name || "Unknown"}
          <button className="leave-review-btn" onClick={scrollToReviewSection}>
            Leave a Review
          </button>
        </p>
      </div>

      <div className="trip-content">
        {/* Gallery */}
        <div className="trip-gallery">
          <div className="top-gallery">
            <img src={data.image || "/fallback.jpg"} alt={data.title} />
            <img src={data.image || "/fallback.jpg"} alt={data.title} />
          </div>

          <div className="bottom-imgs">
            <img src={data.image || "/fallback.jpg"} alt={data.title} />
            <img src={data.image || "/fallback.jpg"} alt={data.title} />
            <div className="testimonial">
              <p>
                “The guide was exceptional, and the trip was well organized.”
              </p>
              <div className="testimonial-footer">
                <span>Priya · Travelled in May</span>
                <span>
                  <FaStar className="star" /> 5.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Box */}
        <div className="trip-info-box">
          <h3>
            From <strong>{data.price}</strong>
          </h3>

          <button className="wishlist-btn">
            Add to my wishlist <CiHeart />
          </button>

          <button className="book-btn" onClick={onViewDatesClick}>
            View Dates And Book
          </button>

          <div className="trip-actions">
            <p className="plan-title">Plan your adventure:</p>
            <a href="#" className="download">
              <FaFileDownload /> Download PDF Brochure
            </a>
            <a href="#" className="contact">
              <FaPhoneAlt /> Contact Operator
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Icons */}
      <div className="trip-icons">
        <div>
          <FaUserFriends /> Platinum Operator
        </div>
        <div>
          <FaUsers /> Group Tour
        </div>
        <div>
          <FaLanguage /> English Guided
        </div>
        <div>
          <FaMapSigns /> Age 1 to 99
        </div>
        <div>
          <FaGlobe /> Cultural Experience
        </div>
        <div>
          <FaMapSigns /> Partial Guided
        </div>
        <div>
          <FaUsers /> Group Size 2 - 15
        </div>
      </div>
    </section>
  );
}
