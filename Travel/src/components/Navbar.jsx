import React, { useState } from "react";
import { FaHeart, FaGlobe, FaPhone, FaUser } from "react-icons/fa";
import img2 from "../assets/img2.jpg";
import "../styles/Navbar.css";

export default function GoldenNavbar() {
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);

  const toggleDestMenu = () => setMenuClicked(!menuClicked);
  const showMenu = isDestOpen || menuClicked;

  return (
    <nav className="new-navbar">
      <div className="nav-container">
        <div className="brand">GoldenLeaf Travels</div>

        <ul className="nav-links">
          <li
            className="dropdown"
            onMouseEnter={() => setIsDestOpen(true)}
            onMouseLeave={() => setIsDestOpen(false)}
          >
            <a
              href="#"
              className={`dropdown-link ${showMenu ? "open" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                toggleDestMenu();
              }}
            >
              Destinations ▾
            </a>

            <div className={`mega-menu-columns ${showMenu ? "show" : ""}`}>
              <div className="column">
                <h3>Continents & Regions</h3>
                <ul>
                  {[
                    "Central Asia & China",
                    "Europe & the Caucasus",
                    "Indian Subcontinent",
                    "Latin America",
                    "North Africa & Middle East",
                    "South East Asia & Pacific",
                    "Sub Saharan Africa",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="column">
                <h3>Popular Destinations</h3>
                <ul>
                  {[
                    "Afghanistan",
                    "China",
                    "Kazakhstan",
                    "Kyrgyzstan",
                    "Mongolia",
                    "Tajikistan",
                    "The Silk Road",
                    "Turkmenistan",
                    "Uzbekistan",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="column uzbek-column">
                <img src={img2} alt="Uzbekistan" />
                <h4>Uzbekistan: Land of Silk Road Treasures</h4>
                <p>
                  Combine the Silk Road cities of Samarkand, Khiva and Bukhara,
                  as well as enjoy rural Uzbek life in the Nuratau Mountains.
                </p>
                <button className="view-trip">View Trip →</button>
              </div>
            </div>
          </li>

          <li><a href="#">Holiday Types</a></li>
          <li><a href="#">Inspiring Stories</a></li>
          <li><a href="#">About Us</a></li>
        </ul>

        <div className="actions">
          <FaHeart className="icon" />
          <FaGlobe className="icon" />
          <FaPhone className="icon" />
          <button className="login-btn"><FaUser /> Login</button>
        </div>
      </div>
    </nav>
  );
}
