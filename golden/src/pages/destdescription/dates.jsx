import React, { useState } from "react";
import dates from "../../data/dates";
import "../../pagescss/dates.css";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaGlobe, FaBed } from "react-icons/fa";

export default function DatesSection() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [filterMonth, setFilterMonth] = useState("All Months");
  const [sortBy, setSortBy] = useState("Start date (earliest)");
  const navigate = useNavigate();

  const handleToggle = () => {
    setVisibleCount(visibleCount === sortedDates.length ? 5 : sortedDates.length);
  };

  // Month names array to map date month index to name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter dates by selected month
  const filteredDates = dates.filter((item) => {
    if (filterMonth === "All Months") return true;
    const dateObj = new Date(item.startDate);
    const monthName = monthNames[dateObj.getMonth()];
    return monthName === filterMonth;
  });

  // Sort filtered dates based on selected sort option
  const sortedDates = [...filteredDates].sort((a, b) => {
    switch (sortBy) {
      case "Start date (earliest)":
        return new Date(a.startDate) - new Date(b.startDate);
      case "Start date (latest)":
        return new Date(b.startDate) - new Date(a.startDate);
      case "Price (lowest)":
        return parseFloat(a.discountedPrice.replace(/[^0-9.-]+/g, "")) - parseFloat(b.discountedPrice.replace(/[^0-9.-]+/g, ""));
      case "Price (highest)":
        return parseFloat(b.discountedPrice.replace(/[^0-9.-]+/g, "")) - parseFloat(a.discountedPrice.replace(/[^0-9.-]+/g, ""));
      default:
        return 0;
    }
  });

  return (
    <div className="dates-container">
      <h2 className="dates-title">Dates and Availability</h2>

      <div className="dates-filters">
        <select
          className="filter-dropdown"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option>All Months</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
        </select>

        <select
          className="sort-dropdown"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option>Start date (earliest)</option>
          <option>Start date (latest)</option>
          <option>Price (lowest)</option>
          <option>Price (highest)</option>
        </select>
      </div>

      {sortedDates.slice(0, visibleCount).map((item) => (
        <div className="date-card fade-in" key={item.id}>
          <div className="date-left">
            <div className="date-range">
              <div>
                <span>From Sunday</span>
                <strong>{item.startDate}</strong>
              </div>
              <span className="arrow">→</span>
              <div>
                <span>To Tuesday</span>
                <strong>{item.endDate}</strong>
              </div>
            </div>

            <div className="date-info">
              <p><FaGlobe /> {item.language}</p>
              <p><FaCheckCircle /> {item.guaranteed ? "Guaranteed departure" : "Subject to availability"}</p>
              <p><FaBed /> {item.rooms}</p>
            </div>
          </div>

          <div className="date-right">
            <div className="discount-badge-wrapper">
              {item.discountPercent && (
                <span className="discount-badge">-{item.discountPercent}</span>
              )}
            </div>

            <div className="price-line">
              <span>From:</span>
              {item.originalPrice && (
                <span className="original-price">{item.originalPrice}</span>
              )}
              <span className="discounted-price">{item.discountedPrice}</span>
            </div>

            <select className="payment-select">
              <option>Payment Plan</option>
              <option>Full Payment</option>
            </select>

            <button
              className="confirm-btn"
              onClick={() => navigate("/payment")}
            >
              Confirm Dates
            </button>
          </div>
        </div>
      ))}

      <div className="view-more-wrapper">
        <button className="view-more-btn" onClick={handleToggle}>
          {visibleCount === sortedDates.length ? "View Less Dates →" : "View More Dates →"}
        </button>
      </div>
    </div>
  );
}
 