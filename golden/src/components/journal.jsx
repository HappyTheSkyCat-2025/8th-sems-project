import React, { useState } from "react";
import journal from "../data/journal";
import { FaCalendarAlt, FaCommentDots } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import "../styles/journal.css";

export default function Journal() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen((prev) => !prev);

  return (
    <section className="journal-section" style={{ position: "relative" }}>
      <h2 className="journal-title">Travel journal</h2>
      <div className="underline" />
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
          </article>
        ))}
      </div>

      <div className="view-all-wrapper">
        <button className="view-all-btn">
          View all articles <IoIosArrowForward />
        </button>
      </div>

      {/* Chatbot icon button */}
      <button className="chatbot-button" onClick={toggleChat} aria-label="Chat with us">
        <FaCommentDots size={24} />
      </button>

      {/* Optional: simple chat box popup */}
      {chatOpen && (
        <div className="chatbox">
          <div className="chatbox-header">
            <h4>Chat with us</h4>
            <button className="chatbox-close" onClick={toggleChat}>×</button>
          </div>
          <div className="chatbox-body">
            <p>Hi! How can we help you today?</p>
            {/* You can add input & send button here later */}
          </div>
        </div>
      )}
    </section>
  );
}
