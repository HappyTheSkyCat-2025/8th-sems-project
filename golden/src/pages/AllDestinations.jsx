import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/AllDestinations.css";

export default function AllDestinations() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios
      .get("/api/destinations/countries/")
      .then((res) => setCountries(res.data.results)) // ✅ Use results
      .catch((err) => console.error("Failed to load countries", err));
  }, []);

  return (
    <div className="destinations-page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link> <span>›</span> <span>Destinations</span>
      </div>

      <h1 className="page-title">Explore All Destinations</h1>

      <div className="destination-grid">
        {countries.map((country, index) => (
          <Link
            to={`/destinations/${country.slug}`}
            className="destination-card"
            key={index}
          >
            <img
              src={country.image || "/fallback-image.jpg"} // ✅ fallback if image is null
              alt={country.name}
            />
            <div className="card-overlay">
              <h3>{country.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
