import React, { useState, useEffect } from "react";
import { ChevronDown, Globe, Heart, User, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo1.png";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  // Destinations
  const [regions, setRegions] = useState([]);
  const [countriesByRegion, setCountriesByRegion] = useState({});
  const [activeRegion, setActiveRegion] = useState(null);

  // Dynamic Travel Types & Deals
  const [travelTypes, setTravelTypes] = useState([]);
  const [travelOptions, setTravelOptions] = useState({});
  const [activeTravelType, setActiveTravelType] = useState(null);

  const [dealCategories, setDealCategories] = useState([]);
  const [dealItems, setDealItems] = useState({});
  const [activeDealCategory, setActiveDealCategory] = useState(null);

  // UI states
  const [showDestinations, setShowDestinations] = useState(false);
  const [showWaysToTravel, setShowWaysToTravel] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(false);

  // Fetch destinations
  useEffect(() => {
    axios.get("/api/destinations/")
      .then(res => {
        const regionList = res.data.regions.map(r => r.region_name);
        const countriesMap = {};
        res.data.regions.forEach(r => {
          countriesMap[r.region_name] = r.countries.map(c => ({
            name: c.name,
            slug: c.slug
          }));
        });

        setRegions(regionList);
        setCountriesByRegion(countriesMap);
        setActiveRegion(regionList[0] || null);
      })
      .catch(err => console.error("Failed to load destinations:", err));
  }, []);

  // Fetch travel types and options
  useEffect(() => {
    axios.get("/api/destinations/travel-types/")
      .then(res => {
        const types = res.data.types;
        const optionsMap = res.data.options || {};
        setTravelTypes(types);
        setTravelOptions(optionsMap);
        setActiveTravelType(types[0] || null);
      })
      .catch(err => console.error("Failed to load travel types:", err));
  }, []);

  // Fetch deal categories and offers
  useEffect(() => {
    axios.get("/api/destinations/deals/")
      .then(res => {
        const categories = res.data.categories;
        const offersMap = res.data.offers || {};
        setDealCategories(categories);
        setDealItems(offersMap);
        setActiveDealCategory(categories[0] || null);
      })
      .catch(err => console.error("Failed to load deals:", err));
  }, []);

  // Scroll tracking for search icon
  useEffect(() => {
    const handleScroll = () => {
      setShowSearchIcon(window.scrollY > 100);
    };

    if (location.pathname !== "/") {
      setShowSearchIcon(true);
    } else {
      window.addEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") {
      setShowSearchBar(false);
    }
  }, [location.pathname]);

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
        <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Golden Leaf Travels" />
          <span>
            Golden Leaf
            <br />
            Travels
          </span>
        </div>

        {/* Navigation */}
        <nav className="navbar-links">
          {/* Destinations */}
          <div
            className="dropdown"
            onMouseEnter={() => setShowDestinations(true)}
            onMouseLeave={() => setShowDestinations(false)}
          >
            <span className="link-item">
              Destinations <ChevronDown size={14} />
            </span>
{showDestinations && activeRegion && (
  <div className="mega-menu no-search">
    <div className="mega-columns">
      <div className="column">
        <h4>Destinations</h4>
        <ul>
          {regions.map((region, idx) => (
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
          {(countriesByRegion[activeRegion] || []).map((country, idx) => (
            <li key={idx}>
              <Link to={`/destinations/${country.slug}`} className="plain-link">
                {country.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Image + Description + Learn More Button */}
      <div className="column image-column">
        <img src="/images/sample-region.jpg" alt={activeRegion} />
        <p className="image-description">
          Discover unforgettable journeys in <strong>{activeRegion}</strong>. Whether you love beaches, mountains, or cities, we’ve got something magical waiting for you.
        </p>
        <Link to={`/destinations/${activeRegion.toLowerCase()}`} className="read-more-btn">
          Learn More
        </Link>
      </div>
    </div>
  </div>
)}

          </div>

          {/* Ways to Travel */}
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
                      {travelTypes.map((type, idx) => (
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
                      {(travelOptions[activeTravelType] || []).map((option, idx) => (
                        <li key={idx}>{option}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Deals */}
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
                      {dealCategories.map((cat, idx) => (
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
                      {(dealItems[activeDealCategory] || []).map((deal, idx) => (
                        <li key={idx}>{deal}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* About */}
          <Link to="/about" className="link-item plain-link">
            About Us
          </Link>
        </nav>

        {/* Icons */}
        <div className="navbar-icons">
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
          <div className="profile-dropdown">
            <User size={18} onClick={() => setShowProfile(!showProfile)} style={{ cursor: "pointer" }} />
            {showProfile && (
              <div className="profile-menu">
                <Link to="/profile" className="profile-item">My Profile</Link>
                <Link to="/login" className="profile-item">Log In</Link>
              </div>
            )}
          </div>
          <button className="contact-btn">Contact Us</button>
        </div>
      </div>

      {/* Search Bar */}
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
