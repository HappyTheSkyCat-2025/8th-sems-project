import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AllDestinations.css";
import AOS from "aos";
import "aos/dist/aos.css";

import baliImage from "../assets/bali.jpg";
import img2 from "../assets/img2.jpg";

const continents = [
  { name: "Asia", desc: "Explore diverse cultures, vibrant cities, and rich traditions.", image: img2 },
  { name: "Europe", desc: "Visit historic landmarks, art, and breathtaking landscapes.", image: img2 },
  { name: "Africa", desc: "Discover wildlife safaris, deserts, and cultural wonders.", image: img2 },
  { name: "North America", desc: "Experience modern cities, national parks, and diversity.", image: img2 },
  { name: "South America", desc: "Adventure through rainforests, beaches, and mountains.", image: img2 },
  { name: "Australia", desc: "Uncover beaches, reefs, and unique wildlife.", image: img2 },
  { name: "Antarctica", desc: "Venture into icy wilderness and majestic glaciers.", image: img2 },
];

const topDestinations = [
  "Paris, France", "Tokyo, Japan", "Cape Town, South Africa", "New York City, USA", "Rio de Janeiro, Brazil",
  "Rome, Italy", "Sydney, Australia", "Kathmandu, Nepal", "Barcelona, Spain", "Istanbul, Turkey",
];

const AllDestinations = () => {
  const navigate = useNavigate();
  const [continentPage, setContinentPage] = useState(1);
  const [destinationPage, setDestinationPage] = useState(1);

  const continentsPerPage = 6;
  const destinationsPerPage = 3;

  const totalContinentPages = Math.ceil(continents.length / continentsPerPage);
  const totalDestinationPages = Math.ceil(topDestinations.length / destinationsPerPage);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="all-destinations">
      <div className="breadcrumb">
        <Link to="/">Home</Link> <span>&gt;</span> <span>All Destinations</span>
      </div>

      <div className="header-image" style={{ backgroundImage: `url(${baliImage})` }}>
        <div className="overlay">
          <h1>All Destinations</h1>
        </div>
      </div>

      <div className="intro-text" data-aos="fade-up">
        <p>
          Discover a world of adventure, culture, and unforgettable memories. Choose your continent and start exploring today.
        </p>
      </div>

      {/* Where You Can Go Section */}
      <h2 className="section-title" >Where You Can Go?</h2>
      <div className="section-underline"></div>

      <div className="continent-grid">
        {paginate(continents, continentPage, continentsPerPage).map((item, index) => (
          <div className="continent-card" key={index} data-aos="zoom-in">
            <img src={item.image} alt={item.name} />
            <div className="continent-info">
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <button onClick={() => navigate("/search")}>See More</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-center">
        <button disabled={continentPage === 1} onClick={() => setContinentPage(continentPage - 1)}>&laquo;</button>
        <span>Page {continentPage} of {totalContinentPages}</span>
        <button disabled={continentPage === totalContinentPages} onClick={() => setContinentPage(continentPage + 1)}>&raquo;</button>
      </div>

      {/* Top Destinations Section */}
      <div className="top-destinations-slider" data-aos="fade-up">
        <h2>Our Top 10 Destinations</h2>
        <p>
          These are the most loved destinations by travelers from around the globe. Whether you're into history, adventure, food, or relaxation,
          these spots have something special for every kind of explorer.
        </p>

        <div className="top-destinations-row" data-aos="fade-up">
          {paginate(topDestinations, destinationPage, destinationsPerPage).map((place, idx) => {
            const [city, country] = place.split(", ");
            return (
              <div className="slide-card" key={idx}>
                <img src={img2} alt={place} />
                <div className="slide-content">
                  <h3>{city}</h3>
                  <p className="country">{country}</p>
                  <p className="desc">
                    {city} is a captivating destination offering a mix of cultural experiences, beautiful sights, and unforgettable adventures.
                    From historical landmarks to modern attractions, {city} has something for every traveler.
                  </p>
                  <button className="trip-btn">Trips in {country}</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pagination-center">
          <button disabled={destinationPage === 1} onClick={() => setDestinationPage(destinationPage - 1)}>&laquo;</button>
          <span>Page {destinationPage} of {totalDestinationPages}</span>
          <button disabled={destinationPage === totalDestinationPages} onClick={() => setDestinationPage(destinationPage + 1)}>&raquo;</button>
        </div>
      </div>
    </div>
  );
};

export default AllDestinations;
