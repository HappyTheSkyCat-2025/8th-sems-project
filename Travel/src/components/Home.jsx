import React from 'react';
import vid1 from '../assets/vid1.mp4';
import '../styles/Home.css';

export default function Home() {
  return (
    <section className="home-section">
      <video className="background-video" autoPlay loop muted>
        <source src={vid1} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay"></div>

      <div className="form-container">
        <form className="travel-form">
          <div className="checkboxes">
            <label><input type="checkbox" /> Group Tour</label>
            <label><input type="checkbox" /> Tailor-Made</label>
          </div>

          <select>
            <option>Destination</option>
            <option>Nepal</option>
            <option>Bhutan</option>
            <option>Tibet</option>
          </select>

          <select>
            <option>Month</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
          </select>

          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="home-content">
        <h1>Extraordinary Travel Experiences</h1>
        <p>Small group tours and tailor-made holidays</p>
        <div className="trustpilot">
          <span>Excellent</span>
          <span>★★★★★</span>
        </div>
      </div>
    </section>
  );
}
