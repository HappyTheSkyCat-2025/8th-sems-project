import React, { useState } from "react";
import "../styles/stories.css";
import stories from "../data/stories"; // ✅ using "stories" now

export default function Stories() {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!stories || stories.length === 0) {
    return (
      <section className="story-section">
        <h2 className="story-title">Real stories from real travelers</h2>
        <div className="underline" />
        <p className="story-subtitle">
          Hear from travelers who have experienced our journey first-hand.
        </p>
        <p>No stories available at the moment.</p>
      </section>
    );
  }

  const nextStory = () => {
    setCurrentIndex((prev) =>
      prev === stories.length - 1 ? 0 : prev + 1
    );
  };

  const prevStory = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? stories.length - 1 : prev - 1
    );
  };

  const { name, location, message, photo } = stories[currentIndex];

  return (
    <section className="story-section">
      <h2 className="story-title">Real stories from real travelers</h2>
      <div className="underline" />
      <p className="story-subtitle">
        Hear from travelers who have experienced our journey first-hand.
      </p>

      <div className="story-slider">
        <button onClick={prevStory} className="arrow-btn">‹</button>

        <div className="story-card">
          <img src={photo} alt={name} className="story-photo" />
          <p className="story-message">"{message}"</p>
          <h4 className="story-name">{name}</h4>
          <span className="story-location">{location}</span>
        </div>

        <button onClick={nextStory} className="arrow-btn">›</button>
      </div>
    </section>
  );
}
