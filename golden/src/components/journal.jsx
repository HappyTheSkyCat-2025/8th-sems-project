import React from "react";
import journal from "../data/journal";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import "../styles/journal.css";

export default function Journal() {
  return (
    <section className="journal-section" style={{ position: "relative" }}>
      <h2 className="journal-title">Travel journal</h2>
      <div className="underline journal" />
      <p className="journal-description">
        Read inspiring stories and insights from our seasoned travelers.
      </p>

      <div className="journal-grid">
        {journal.map(({ id, title, description, date, category, image }) => (
          <article key={id} className="journal-card">
            <div className="journal-badge">{category}</div>
            <img src={image} alt={title} className="journal-img" />
            <div className="journal-date">
              <FaCalendarAlt className="calendar-icon" /> {date}
            </div>
            <h3 className="journal-card-title">{title}</h3>
            <p className="journal-card-description">{description}</p>
            <div className="read-more">
              Read more <IoIosArrowForward />
            </div>
          </article>
        ))}
      </div>

      <div className="view-all-wrapper">
        <button className="view-all-btn">
          View all articles <IoIosArrowForward />
        </button>
      </div>
    </section>
  );
}
