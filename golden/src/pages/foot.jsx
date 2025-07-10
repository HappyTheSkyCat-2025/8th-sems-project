import React from "react";
import "../pagescss/foot.css";
import worldPlaneIcon from "../assets/world-plane-icon.png"; // Use your uploaded icon here

export default function PurposeSection() {
  return (
    <section className="purpose-container">
      <div className="purpose-icon">
        <img src={worldPlaneIcon} alt="World and Plane Icon" />
      </div>
      <div className="purpose-text">
        <p className="purpose-subheading">
          Goldenleaf Travel — Small Group Adventures with a Meaningful Touch
        </p>
        <h2 className="purpose-heading">
          We design small group journeys that feel personal and leave a positive impact — on both the places we visit and the people we travel with.
        </h2>
        <button className="purpose-button">Our purpose</button>
      </div>
    </section>
  );
}
