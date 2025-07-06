import React, { useState } from "react";
import "../styles/stories.css";
import stories from "../data/stories";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Stories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!stories || stories.length === 0) {
    return (
      <section className="story-section">
        <h2 className="story-title">Real Stories from Real Travelers</h2>
        <div className="underline" />
        <p className="story-subtitle">
          Hear from travelers who have experienced our journeys firsthand.
        </p>
        <p>No stories available at the moment.</p>
      </section>
    );
  }

  const nextStory = () => {
    setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const prevStory = () => {
    setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const { name, location, message, photo } = stories[currentIndex];

  return (
    <section className="story-section">
      <h2 className="story-title">Real Stories from Real Travelers</h2>
      <div className="underline gold" />
      <p className="story-subtitle">
        Hear from travelers who have experienced our journeys firsthand.
      </p>

      <div className="story-slider">
        <button onClick={prevStory} className="arrow-btn circle">
          <FaChevronLeft />
        </button>

        <div className="story-card">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} color="#ddb148" />
            ))}
          </div>
          <p className="story-message">“{message}”</p>
          <div className="story-user">
            <img src={photo} alt={name} className="story-photo" />
            <div>
              <h4 className="story-name">{name}</h4>
              <span className="story-location">{location}</span>
            </div>
          </div>
        </div>

        <button onClick={nextStory} className="arrow-btn circle">
          <FaChevronRight />
        </button>
      </div>
    </section> 
  );
}
