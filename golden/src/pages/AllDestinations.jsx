import React from "react";
import { Link } from "react-router-dom";
import "../styles/AllDestinations.css";

// ✅ Import all images here
import nepalImg from "../assets/bali.jpg";
import italyImg from "../assets/img2.jpg";
import japanImg from "../assets/img2.jpg";
import franceImg from "../assets/bali.jpg";
import greeceImg from "../assets/bali.jpg";

const destinations = [
  { name: "Nepal", image: nepalImg },
  { name: "Italy", image: italyImg },
  { name: "Japan", image: japanImg },
  { name: "France", image: franceImg },
  { name: "Greece", image: greeceImg },
];

export default function AllDestinations() {
  return (
    <div className="destinations-page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link> <span>›</span> <span>All Destinations</span>
      </div>

      <h1 className="page-title">Explore All Destinations</h1>

      <div className="destination-grid">
        {destinations.map((country, index) => (
          <Link
            to={`/destinations/${country.name.toLowerCase()}`}
            className="destination-card"
            key={index}
          >
            <img src={country.image} alt={country.name} />
            <div className="card-overlay">
              <h3>{country.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
