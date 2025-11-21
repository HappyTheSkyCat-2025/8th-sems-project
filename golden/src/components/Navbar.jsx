import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Heart,
  User,
  Search,
  Phone,
} from "lucide-react";
import { IoLanguageOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Divide as Hamburger } from "hamburger-react";
import axiosInstance from "../utils/axiosInstance"; // Assuming this is set up correctly
import logo from "../assets/logo1.png";
import baliImage from "../assets/bali.jpg";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [regions, setRegions] = useState([]);
  const [countriesByRegion, setCountriesByRegion] = useState({});
  const [travelTypes, setTravelTypes] = useState([]);
  const [travelOptions, setTravelOptions] = useState({});
  const [dealCategories, setDealCategories] = useState([]);
  const [dealItems, setDealItems] = useState({});

  const [activeRegion, setActiveRegion] = useState(null);
  const [activeTravelType, setActiveTravelType] = useState(null);
  const [activeDealCategory, setActiveDealCategory] = useState(null);
  const [showDestinations, setShowDestinations] = useState(false);
  const [showWaysToTravel, setShowWaysToTravel] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(false);
  
  // NEW STATE FOR SEARCH INPUT
  const [searchTerm, setSearchTerm] = useState("");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState("main");
  const [mobileActiveRegion, setMobileActiveRegion] = useState(null);
  const [activeCountry, setActiveCountry] = useState(null);
  // Removed unused 'move' state

  useEffect(() => {
    // --- Data Fetching ---
    axiosInstance.get("destinations/").then((res) => {
      const regionList = res.data.regions.map((r) => r.region_name);
      const map = {};
      res.data.regions.forEach((r) => {
        map[r.region_name] = r.countries.map((c) => ({
          name: c.name,
          slug: c.slug,
        }));
      });
      setRegions(regionList);
      setCountriesByRegion(map);
      setActiveRegion(regionList[0] || null);
    });

    axiosInstance.get("destinations/travel-types/").then((res) => {
      const { types, options = {} } = res.data;
      setTravelTypes(types);
      setTravelOptions(options);
      setActiveTravelType(types[0] || null);
    });

    axiosInstance.get("destinations/deals/").then((res) => {
      const { categories, offers = {} } = res.data;
      setDealCategories(categories);
      setDealItems(offers);
      setActiveDealCategory(categories[0] || null);
    });
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("access_token"));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setShowSearchIcon(window.scrollY > 100);
    if (location.pathname !== "/") setShowSearchIcon(true);
    else window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/") setShowSearchBar(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdowns = document.querySelectorAll(".dropdown");
      // If the click target is NOT inside any of the dropdown elements, close them all.
      if (![...dropdowns].some((el) => el.contains(e.target))) {
        setShowDestinations(false);
        setShowWaysToTravel(false);
        setShowDeals(false);
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    setShowProfile(false);
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const mobileBack = () => {
    if (mobileView === "countries") setMobileView("destinations");
    else setMobileView("main");
  };

  /**
   * Universal function to navigate to the search page with a specific payload.
   * @param {string} type - The type of search (region, country, travel, deal, text).
   * @param {string} value - The primary value/key to search for.
   * @param {string} [slug] - Optional slug for routing/details.
   */
  const handleSearchNavigation = (type, value, slug = "") => {
    setShowDestinations(false);
    setShowWaysToTravel(false);
    setShowDeals(false);
    setShowSearchBar(false);
    setIsMobileMenuOpen(false); // Close mobile menu on navigate

    navigate("/search", {
      state: {
        searchType: type,
        searchTerm: value,
        searchSlug: slug,
      },
    });
  };

  const handleTextSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
        if (searchTerm.trim()) {
            handleSearchNavigation('text', searchTerm.trim());
        }
    }
  };


  // Helper function to handle country/link clicks inside mega menus
  const handleMegaMenuLinkClick = (type, value, slug) => (e) => {
    // e.preventDefault(); // Uncomment if you want to prevent default Link behavior
    handleSearchNavigation(type, value, slug);
  };


  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo" onClick={handleLogoClick}>
            <img src={logo} alt="Golden Leaf Travels" />
            <span>
              Golden Leaf
              <br />
              Travels
            </span>
          </div>

          <div className="hamburger-wrapper">
            <Hamburger
              toggled={isMobileMenuOpen}
              toggle={(t) => {
                setIsMobileMenuOpen(t);
                setMobileView("main");
              }}
              size={20}
            />
          </div>

          <nav className="navbar-links">
            {/* Destinations */}
            <div
              className="dropdown"
              onClick={() => {
                setShowDestinations(!showDestinations);
                setShowWaysToTravel(false);
                setShowDeals(false);
                setShowProfile(false);
              }}
            >
              <span className="link-item">
                Destinations <ChevronDown size={14} />
              </span>
              {showDestinations && activeRegion && (
                <div className="mega-menu-dest">
                  <div className="mega-columns">
                    {/* Regions column */}
                    <div className="column">
                      <ul>
                        {regions.map((r) => (
                          <li
                            key={r}
                            onClick={() => {
                              setActiveRegion(r);
                              setActiveCountry(null);
                              // We don't navigate on region click, just update the panel view
                            }}
                            className={
                              activeRegion === r ? "region-active" : ""
                            }
                            onMouseEnter={() => setActiveRegion(r)}
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Countries column */}
                    <div className="column countries-column">
                      <div className="countries-subcolumns">
                        {(() => {
                          const countries =
                            countriesByRegion[activeRegion] || [];
                          const firstCol = countries.slice(0, 6);
                          const secondCol = countries.slice(6, 12);
                          return (
                            <>
                              <ul>
                                {firstCol.map((c) => (
                                  <li key={c.slug}>
                                    {/* UPDATED: Link navigates to /search */}
                                    <Link
                                      to="/search"
                                      className="plain-link"
                                      onClick={handleMegaMenuLinkClick('country', c.name, c.slug)}
                                    >
                                      {c.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <ul>
                                {secondCol.map((c) => (
                                  <li key={c.slug}>
                                    {/* UPDATED: Link navigates to /search */}
                                    <Link
                                      to="/search"
                                      className="plain-link"
                                      onClick={handleMegaMenuLinkClick('country', c.name, c.slug)}
                                    >
                                      {c.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          );
                        })()}
                      </div>
                      {/* UPDATED: "View all" button navigates to /search */}
                      <button
                        className="view-all-region-btn"
                        onClick={() => handleSearchNavigation('region', activeRegion, activeRegion.toLowerCase())}
                      >
                        View all {activeRegion}
                      </button>
                    </div>
                    {/* Featured card column */}
                    <div className="column image-column">
                      <div className="featured-card">
                        <div className="featured-image-wrapper">
                          <img
                            src={baliImage}
                            alt={
                              activeCountry ? activeCountry.name : activeRegion
                            }
                            className="featured-image"
                          />
                          <div className="featured-overlay">
                            <div className="featured-title">
                              {activeCountry ? activeCountry.name : activeRegion}
                            </div>
                            <div className="featured-desc">
                              {activeCountry
                                ? `Explore ${activeCountry.name} with all our heart and money.`
                                : `Discover unforgettable journeys in ${activeRegion}.`}
                            </div>
                            {/* UPDATED: "View Trip" button navigates to /search */}
                            <Link
                              to="/search"
                              className="featured-btn"
                              onClick={handleMegaMenuLinkClick(
                                activeCountry ? 'country' : 'region',
                                activeCountry ? activeCountry.name : activeRegion,
                                activeCountry ? activeCountry.slug : activeRegion.toLowerCase()
                              )}
                            >
                              View Trip
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ways to Travel */}
            <div
              className="dropdown"
              onClick={() => {
                setShowWaysToTravel(!showWaysToTravel);
                setShowDestinations(false);
                setShowDeals(false);
                setShowProfile(false);
              }}
            >
              <span className="link-item">
                Ways to Travel <ChevronDown size={14} />
              </span>
              {showWaysToTravel && activeTravelType && (
                <div className="mega-menu-ways">
                  <div className="mega-columns">
                    <div className="column">
                      <ul>
                        {travelTypes.map((t) => (
                          <li
                            key={t}
                            onClick={() => setActiveTravelType(t)}
                            className={activeTravelType === t ? "active" : ""}
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column">
                      <ul>
                        {/* Option links use generic search navigation */}
                        {(travelOptions[activeTravelType] || []).map((o) => (
                          <li key={o} onClick={() => handleSearchNavigation('travel_option', o)}>
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column image-column">
                      <img src={baliImage} alt={activeTravelType} />
                      <p className="image-description">
                        Discover flexible adventures with{" "}
                        <strong>{activeTravelType}</strong> style.
                      </p>
                      {/* UPDATED: "Explore More" button navigates to /search */}
                      <Link
                        to="/search"
                        className="read-more-btn"
                        onClick={handleMegaMenuLinkClick('travel_type', activeTravelType, activeTravelType.toLowerCase())}
                      >
                        Explore More
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deals */}
            <div
              className="dropdown"
              onClick={() => {
                setShowDeals(!showDeals);
                setShowWaysToTravel(false);
                setShowDestinations(false);
                setShowProfile(false);
              }}
            >
              <span className="link-item">
                Deals <ChevronDown size={14} />
              </span>
              {showDeals && activeDealCategory && (
                <div className="mega-menu-deals">
                  <div className="mega-columns">
                    <div className="column">
                      <ul>
                        {dealCategories.map((d) => (
                          <li
                            key={d}
                            onClick={() => setActiveDealCategory(d)}
                            className={activeDealCategory === d ? "active" : ""}
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column">
                      <ul>
                        {/* Deal item links use generic search navigation */}
                        {(dealItems[activeDealCategory] || []).map((o) => (
                          <li key={o} onClick={() => handleSearchNavigation('deal_item', o)}>
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column image-column">
                      <img src={baliImage} alt={activeDealCategory} />
                      <p className="image-description">
                        Grab hot deals in <strong>{activeDealCategory}</strong>{" "}
                        now!
                      </p>
                      {/* UPDATED: "View Offers" button navigates to /search */}
                      <Link
                        to="/search"
                        className="read-more-btn"
                        onClick={handleMegaMenuLinkClick('deal_category', activeDealCategory, activeDealCategory.toLowerCase())}
                      >
                        View Offers
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Us (Existing links unchanged) */}
            <div className="dropdown link-item">
              <span className="dropdown-toggle">About Us</span>
              <div className="dropdown-menu">
                <Link 
                  to="/about" 
                  className="dropdown-link" 
                  onClick={() => setShowProfile(false)}
                >
                  Our Stories
                </Link>
                <Link 
                  to="/blogs" 
                  className="dropdown-link"
                  onClick={() => setShowProfile(false)}
                >
                  Blogs
                </Link>
                <Link 
                  to="/write" 
                  className="dropdown-link"
                  onClick={() => setShowProfile(false)}
                >
                  Write for us
                </Link>
              </div>
            </div>
          </nav>

          {/* Desktop Icons */}
          <div className="navbar-icons">
            <button
              className={`search-icon ${
                showSearchIcon ? "visible" : "hidden"
              }`}
              onClick={() => setShowSearchBar((p) => !p)}
            >
              <Search size={20} />
            </button>

            <div className="language-switch">
              <IoLanguageOutline size={20} />
            </div>
            <Link
              to="/profile"
              state={{ tab: "favourites" }}
              className="wishlist-icon"
              onClick={() => setShowProfile(false)}
            >
              <Heart size={18} />
            </Link>
            <div className="profile-dropdown dropdown">
              <User
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (isAuthenticated) {
                    setShowProfile(!showProfile);
                    setShowDestinations(false);
                    setShowWaysToTravel(false);
                    setShowDeals(false);
                  } else navigate("/login");
                }}
              />
              {isAuthenticated && showProfile && (
                <div className="profile-menu">
                  <Link 
                    to="/profile" 
                    className="profile-item"
                    onClick={() => setShowProfile(false)}
                  >
                    My Profile
                  </Link>
                  <span 
                    onClick={handleLogout} 
                    className="profile-item"
                  >
                    Logout
                  </span>
                </div>
              )}
            </div>
            <Link 
              to="/contact" 
              className="contact-btn" 
              tabIndex={0}
              onClick={() => setShowProfile(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        {showSearchBar && (
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search destinations, deals..."
              autoFocus
              value={searchTerm} // Bind value to state
              onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
              onKeyDown={handleTextSearch} // Handle search on Enter
            />
            {/* Added search icon button for explicit search trigger */}
            <button
              onClick={handleTextSearch}
              className="search-icon"
              style={{ padding: '0', background: 'transparent', border: 'none' }}
              disabled={!searchTerm.trim()}
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => {setShowSearchBar(false); setSearchTerm('');}}
              className="search-close-btn"
            >
              ×
            </button>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        className={`mobile-menu-panel ${isMobileMenuOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="mobile-menu-header">
          {mobileView !== "main" && (
            <button className="mobile-back-btn" onClick={mobileBack}>
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <span />
          <button
            className="mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        {/* Mobile Views */}
        {mobileView === "main" && (
          <ul className="mobile-menu-list">
            <li onClick={() => setMobileView("destinations")}>
              Destinations <ChevronRight size={18} />
            </li>
            <li onClick={() => setMobileView("ways")}>
              Ways to Travel <ChevronRight size={18} />
            </li>
            <li onClick={() => setMobileView("deals")}>
              Deals <ChevronRight size={18} />
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
            </li>
            <hr className="mobile-divider" />
            <li>
              <Heart size={18} />{" "}
              <Link to="/wishlist" className="with-icon" onClick={() => setIsMobileMenuOpen(false)}>
                Wishlist
              </Link>
            </li>
            <li>
              <User size={18} />{" "}
              <Link to="/manage-booking" className="with-icon" onClick={() => setIsMobileMenuOpen(false)}>
                Manage Booking
              </Link>
            </li>
            <li>
              <Phone size={18} />{" "}
              <Link
                to="/contact"
                className="with-icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
            <hr className="mobile-divider" />
            {!isAuthenticated ? (
                <li>
                    <Link to="/login" className="with-icon" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                    </Link>
                </li>
            ) : (
                <li onClick={handleLogout}>
                    Logout
                </li>
            )}
          </ul>
        )}

        {mobileView === "destinations" && (
          <>
            <h2 className="mobile-subtitle">Destinations</h2>
            <ul className="mobile-menu-list sub">
              {regions.map((r) => (
                <li
                  key={r}
                  onClick={() => {
                    setMobileActiveRegion(r);
                    setMobileView("countries");
                  }}
                >
                  {r} <ChevronRight size={18} />
                </li>
              ))}
            </ul>
          </>
        )}

        {mobileView === "countries" && (
          <>
            <h2 className="mobile-subtitle">{mobileActiveRegion}</h2>
            <ul className="mobile-menu-list sub">
              {/* UPDATED: Link navigates to /search for countries */}
              {(countriesByRegion[mobileActiveRegion] || []).map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/search"
                    onClick={handleMegaMenuLinkClick('country', c.name, c.slug)}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              {/* Added a mobile "View All" link */}
              <li key="view-all-mobile">
                  <Link
                      to="/search"
                      onClick={() => handleSearchNavigation('region', mobileActiveRegion, mobileActiveRegion.toLowerCase())}
                      style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}
                  >
                      View all {mobileActiveRegion}
                  </Link>
              </li>
            </ul>
          </>
        )}

        {mobileView === "ways" && (
          <>
            <h2 className="mobile-subtitle">Ways to Travel</h2>
            <ul className="mobile-menu-list sub">
              {/* UPDATED: Link navigates to /search for travel types */}
              {travelTypes.map((t) => (
                <li key={t}>
                  <Link
                    to="/search"
                    onClick={handleMegaMenuLinkClick('travel_type', t, t.toLowerCase())}
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {mobileView === "deals" && (
          <>
            <h2 className="mobile-subtitle">Deals</h2>
            <ul className="mobile-menu-list sub">
              {/* UPDATED: Link navigates to /search for deal categories */}
              {dealCategories.map((d) => (
                <li key={d}>
                  <Link
                    to="/search"
                    onClick={handleMegaMenuLinkClick('deal_category', d, d.toLowerCase())}
                  >
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </>
  );
}