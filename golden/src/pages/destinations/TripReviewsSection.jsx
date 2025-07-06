import React, { useState } from "react";
import reviewsData from "../../data/review"; // Your data file
import { FaStar } from "react-icons/fa";
import "../../pagescss/review.css";

export default function ReviewSection() {
  const [selectedRating, setSelectedRating] = useState(null);

  const totalReviews = reviewsData.length;
  const averageRating =
    reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsData.filter((r) => r.rating === star).length,
  }));

  const filteredReviews = selectedRating
    ? reviewsData.filter((r) => r.rating === selectedRating)
    : reviewsData;

  const handleCheckboxChange = (star) => {
    setSelectedRating(selectedRating === star ? null : star);
  };

  return (
    <section className="review-container">
      {/* Title + Underline */}
      <div className="review-title-wrap">
        <h2 className="review-title">Tour reviews</h2>
        <div className="review-underline" />
      </div>

      {/* Average summary */}
      <div className="review-top-summary">
        <div className="stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} color="#ddb148" />
          ))}
        </div>
        <span className="average-rating">{averageRating.toFixed(1)}</span>
        <span className="total-reviews">{totalReviews} reviews</span>
      </div>

      <div className="review-content-wrapper">
        {/* Sidebar Filters */}
        <aside className="review-filters">
          <h4>Filter by rating</h4>
          {ratingCounts.map(({ star, count }) => (
            <label key={star} className="rating-filter-option">
              <span className="checkbox-column">
                <input
                  type="checkbox"
                  checked={selectedRating === star}
                  onChange={() => handleCheckboxChange(star)}
                />
              </span>
              <span className="stars-column">
                {Array.from({ length: star }).map((_, i) => (
                  <FaStar key={i} color="#f4b400" size={14} />
                ))}
              </span>
              <span className="count-column">{count}</span>
            </label>
          ))}
        </aside>

        {/* Review Cards */}
        <div className="review-list">
          {filteredReviews.map((r) => (
            <div className="review-card" key={r.id}>
              <div className="stars">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <FaStar key={i} color="#f4b400" size={14} />
                ))}
              </div>
              <h3>{r.title}</h3>
              <p className="review-meta">
                <strong>{r.name}</strong> . Traveled {r.travelDate}
              </p>
              <p>{r.content}</p>
              <a href="#" className="read-more">
                Read more
              </a>
              <p className="review-date">Review submitted on {r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
