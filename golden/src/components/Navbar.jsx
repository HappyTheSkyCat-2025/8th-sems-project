import React, { useState, useEffect } from "react";
import { ChevronDown, Globe, Heart, User, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo1.png";
import { navData } from "../data/navData";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  // Dropdown states
  const [activeRegion, setActiveRegion] = useState(navData.destinations.regions[0]);
  const [activeTravelType, setActiveTravelType] = useState(navData.waysToTravel.types[0]);
  const [activeDealCategory, setActiveDealCategory] = useState(navData.deals.categories[0]);

  const [showDestinations, setShowDestinations] = useState(false);
  const [showWaysToTravel, setShowWaysToTravel] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Search bar toggle state
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Track if scrolled past home top
  const [showSearchIcon, setShowSearchIcon] = useState(false);

  const countries = navData.destinations.countriesByRegion[activeRegion] || [];
  const travelOptions = navData.waysToTravel.options[activeTravelType] || [];
  const dealItems = navData.deals.offers[activeDealCategory] || [];

  // Show search icon only after scrolling past home or on pages other than home
  useEffect(() => {
    function handleScroll() {
      setShowSearchIcon(window.scrollY > 100);
    }

    if (location.pathname !== "/") {
      setShowSearchIcon(true);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Hide search bar if navigating back to home top
  useEffect(() => {
    if (location.pathname === "/") {
      setShowSearchBar(false);
    }
  }, [location.pathname]);

  // Navigate to home on logo/title click (scroll to top)
  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
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
          <div
            className="dropdown"
            onMouseEnter={() => setShowDestinations(true)}
            onMouseLeave={() => setShowDestinations(false)}
          >
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
                        <li
                          key={idx}
                          onClick={() => setActiveRegion(region)}
                          className={activeRegion === region ? "active" : ""}
                        >
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
                  {/* Removed image-column here */}
                </div>
              </div>
            )}
          </div>

          {/* Ways to Travel Dropdown */}
          <div
            className="dropdown"
            onMouseEnter={() => setShowWaysToTravel(true)}
            onMouseLeave={() => setShowWaysToTravel(false)}
          >
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
                        <li
                          key={idx}
                          onClick={() => setActiveTravelType(type)}
                          className={activeTravelType === type ? "active" : ""}
                        >
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
                  {/* Removed image-column here */}
                </div>
              </div>
            )}
          </div>

          {/* Deals Dropdown */}
          <div
            className="dropdown"
            onMouseEnter={() => setShowDeals(true)}
            onMouseLeave={() => setShowDeals(false)}
          >
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
                        <li
                          key={idx}
                          onClick={() => setActiveDealCategory(cat)}
                          className={cat === activeDealCategory ? "active" : ""}
                        >
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
                  {/* Removed image-column here */}
                </div>
              </div>
            )}
          </div>

          {/* About Us */}
          <Link to="/about" className="link-item plain-link">
            About Us
          </Link>
        </nav>

        {/* Icons and Profile Dropdown */}
        <div className="navbar-icons">
          {/* Show search icon only if showSearchIcon is true */}
          {showSearchIcon && (
            <button
              aria-label="Toggle Search"
              className="search-icon"
              onClick={() => setShowSearchBar((prev) => !prev)}
            >
              <Search size={20} />
            </button>
          )}

          <div className="language-switch">
            <Globe size={18} />
            <span>EN</span>
          </div>
          <Heart size={18} />

          {/* Profile Dropdown */}
          <div className="profile-dropdown">
            <User size={18} onClick={() => setShowProfile(!showProfile)} style={{ cursor: "pointer" }} />
            {showProfile && (
              <div className="profile-menu">
                <Link to="/profile" className="profile-item">
                  My Profile
                </Link>
                <Link to="/login" className="profile-item">
                  Log In
                </Link>
              </div>
            )}
          </div>

          <button className="contact-btn">Contact Us</button>
        </div>
      </div>

      {/* Search bar pops down below navbar */}
      {showSearchBar && (
        <div className="search-bar-wrapper">
          <input type="text" placeholder="Search destinations, deals..." autoFocus />
          <button onClick={() => setShowSearchBar(false)} aria-label="Close search" className="search-close-btn">
            ×
          </button>
        </div>
      )}
    </header>
  );
}
