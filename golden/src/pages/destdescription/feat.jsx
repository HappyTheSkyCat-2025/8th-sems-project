import React, { useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import itineraryData from "../../data/itenary";
import "../../pagescss/feat.css";

export default function Feat() {
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const toggle = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <section className="itinerary-section">
      <div className="itinerary-header">
        <h2>Itinerary</h2>
        <span className="show-all" onClick={handleShowAll}>
          {showAll ? "Collapse all" : "Show all"} <RiArrowDropDownLine />
        </span>
      </div>
      {itineraryData.map((item, index) => {
        const isOpen = showAll || expanded === index;
        return (
          <div key={index} className="itinerary-item">
            <div className="itinerary-day" onClick={() => toggle(index)}>
              <span>
                Day {item.day} : <strong>{item.location}</strong>
              </span>
              <RiArrowDropDownLine
                className={`dropdown-icon ${isOpen ? "rotate" : ""}`}
              />
            </div>

            {isOpen && (
              <div className="itinerary-details">
                <p>{item.description}</p>

                <div className="features">
                  <div>
                    <h4>🛋 Accomodation</h4>
                    <ul><li>{item.accommodation}</li></ul>
                  </div>
                  <div>
                    <h4>⭕ Include activities</h4>
                    <ul>
                      {item.activities.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="meals">
                  <h4>🍽 Meals</h4>
                  <ul>
                    {item.meals.map((meal, i) => (
                      <li key={i}>{meal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
