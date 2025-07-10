import React, { useState } from "react";
import { ChevronDown, Globe, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
import img2 from "../assets/img2.jpg";
import { navData } from "../data/navData";
import "../styles/Navbar.css";

export default function Navbar() {
  const [activeRegion, setActiveRegion] = useState(navData.destinations.regions[0]);
  const [activeTravelType, setActiveTravelType] = useState(navData.waysToTravel.types[0]);
  const [activeDealCategory, setActiveDealCategory] = useState(navData.deals.categories[0]);

  const [showDestinations, setShowDestinations] = useState(false);
  const [showWaysToTravel, setShowWaysToTravel] = useState(false);
  const [showDeals, setShowDeals] = useState(false);

  const countries = navData.destinations.countriesByRegion[activeRegion] || [];
  const travelOptions = navData.waysToTravel.options[activeTravelType] || [];
  const dealItems = navData.deals.offers[activeDealCategory] || [];

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="Golden Leaf Travels" />
          <span>
            Golden Leaf
            <br />
            Travels
          </span>
        </div>

        {/* Nav Links */}
        <nav className="navbar-links">
          {/* Destinations Dropdown */}
          <div className="dropdown" onMouseEnter={() => setShowDestinations(true)} onMouseLeave={() => setShowDestinations(false)}>
            <span className="link-item">
              Destinations <ChevronDown size={14} />
            </span>
            {showDestinations && (
              <div className="mega-menu no-search">
                <div className="mega-columns">
                  <div className="column">
                    <h4>Destinations</h4>
                    <ul>
                      {navData.destinations.regions.map((region, idx) => (
                        <li key={idx} onClick={() => setActiveRegion(region)} className={activeRegion === region ? "active" : ""}>
                          {region}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="column">
                    <h4>Popular Destinations</h4>
                    <ul>
                      {countries.map((country, idx) => (
                        <li key={idx}>
                          <Link to={`/destinations/${country.toLowerCase()}`} className="plain-link">
                            {country}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="column image-column">
                    <img src={img2} alt="Destination" />
                    <p>Explore the wonders of {activeRegion} with curated experiences for every traveler.</p>
                    <Link to={`/destinations/${countries[0]?.toLowerCase()}`} className="read-more-btn plain-link">
                      View Trip
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ways to Travel Dropdown */}
          <div className="dropdown" onMouseEnter={() => setShowWaysToTravel(true)} onMouseLeave={() => setShowWaysToTravel(false)}>
            <span className="link-item">
              Ways to Travel <ChevronDown size={14} />
            </span>
            {showWaysToTravel && (
              <div className="mega-menu no-search">
                <div className="mega-columns">
                  <div className="column">
                    <h4>Travel Types</h4>
                    <ul>
                      {navData.waysToTravel.types.map((type, idx) => (
                        <li key={idx} onClick={() => setActiveTravelType(type)} className={activeTravelType === type ? "active" : ""}>
                          {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="column">
                    <h4>Top Options</h4>
                    <ul>
                      {travelOptions.map((option, idx) => (
                        <li key={idx}>{option}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="column image-column">
                    <img src={img2} alt="Ways to Travel" />
                    <p>Discover flexible travel styles — solo, luxury, or group-guided adventures.</p>
                    <button className="read-more-btn">Explore Options</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deals Dropdown */}
          <div className="dropdown" onMouseEnter={() => setShowDeals(true)} onMouseLeave={() => setShowDeals(false)}>
            <span className="link-item">
              Deals <ChevronDown size={14} />
            </span>
            {showDeals && (
              <div className="mega-menu no-search deals-menu">
                <div className="mega-columns">
                  <div className="column">
                    <h4>Deals</h4>
                    <ul>
                      {navData.deals.categories.map((cat, idx) => (
                        <li key={idx} onClick={() => setActiveDealCategory(cat)} className={cat === activeDealCategory ? "active" : ""}>
                          {cat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="column">
                    <h4>Top Offers</h4>
                    <ul>
                      {dealItems.map((deal, idx) => (
                        <li key={idx}>{deal}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="column image-column">
                    <img src={img2} alt="Deal" />
                    <p>Grab exclusive discounts on premium travel packages — limited time only.</p>
                    <button className="read-more-btn">Explore Deals</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="link-item">About Us</div>
        </nav>

        {/* Icons and Contact */}
        <div className="navbar-icons">
          <div className="language-switch">
            <Globe size={18} />
            <span>EN</span>
          </div>
          <Heart size={18} />
          <User size={18} />
          <button className="contact-btn">Contact Us</button>
        </div>
      </div>
    </header>
  );
}
