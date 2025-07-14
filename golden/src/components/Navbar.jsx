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
import { IoLanguage } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { Divide as Hamburger } from "hamburger-react";
import axios from "axios";
import logo from "../assets/logo1.png";
import baliImage from "../assets/bali.jpg";
import "../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  /* ------------ dynamic data ------------ */
  const [regions, setRegions] = useState([]);
  const [countriesByRegion, setCountriesByRegion] = useState({});
  const [travelTypes, setTravelTypes] = useState([]);
  const [travelOptions, setTravelOptions] = useState({});
  const [dealCategories, setDealCategories] = useState([]);
  const [dealItems, setDealItems] = useState({});

  /* ------------ desktop UI -------------- */
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeTravelType, setActiveTravelType] = useState(null);
  const [activeDealCategory, setActiveDealCategory] = useState(null);
  const [showDestinations, setShowDestinations] = useState(false);
  const [showWaysToTravel, setShowWaysToTravel] = useState(false);
  const [showDeals, setShowDeals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(false);

  /* ------------ mobile drawer ----------- */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState("main"); // main | destinations | countries | ways | deals
  const [mobileActiveRegion, setMobileActiveRegion] = useState(null);

  /* fetch data once */
  useEffect(() => {
    axios.get("/api/destinations/").then((res) => {
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

    axios.get("/api/destinations/travel-types/").then((res) => {
      const { types, options = {} } = res.data;
      setTravelTypes(types);
      setTravelOptions(options);
      setActiveTravelType(types[0] || null);
    });

    axios.get("/api/destinations/deals/").then((res) => {
      const { categories, offers = {} } = res.data;
      setDealCategories(categories);
      setDealItems(offers);
      setActiveDealCategory(categories[0] || null);
    });
  }, []);

  /* search icon visibility */
  useEffect(() => {
    const handleScroll = () => setShowSearchIcon(window.scrollY > 100);
    if (location.pathname !== "/") setShowSearchIcon(true);
    else window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  /* hide search bar on home route change */
  useEffect(() => {
    if (location.pathname === "/") setShowSearchBar(false);
  }, [location.pathname]);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMobileMenuOpen]);

  const handleLogoClick = () => {
    if (location.pathname === "/")
      window.scrollTo({ top: 0, behavior: "smooth" });
    else window.location.href = "/";
  };

  /* ------------ helper for mobile back ------------- */
  const mobileBack = () => {
    if (mobileView === "countries") setMobileView("destinations");
    else setMobileView("main");
  };

  return (
    <>
      {/* ---------------- TOP NAVBAR ---------------- */}
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

          {/* hamburger */}
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

          {/* desktop links */}
          <nav className="navbar-links">
            {/* Destinations dropdown */}
            <div
              className="dropdown"
              onMouseEnter={() => setShowDestinations(true)}
              onMouseLeave={() => setShowDestinations(false)}
            >
              <span className="link-item">
                Destinations <ChevronDown size={14} />
              </span>
              {showDestinations && activeRegion && (
                <div className="mega-menu-dest">
                  <div className="mega-columns">
                    <div className="column">
                      <h4>Destinations</h4>
                      <ul>
                        {regions.map((r) => (
                          <li
                            key={r}
                            onClick={() => setActiveRegion(r)}
                            className={activeRegion === r ? "active" : undefined}
                          >
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column">
                      <h4>Popular Destinations</h4>
                      <ul>
                        {(countriesByRegion[activeRegion] || []).map((c) => (
                          <li key={c.slug}>
                            <Link
                              to={`/destinations/${c.slug}`}
                              className="plain-link"
                            >
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column image-column">
                      <img src={baliImage} alt={activeRegion} />
                      <p className="image-description">
                        Discover unforgettable journeys in{" "}
                        <strong>{activeRegion}</strong>.
                      </p>
                      <Link
                        to={`/destinations/${activeRegion?.toLowerCase()}`}
                        className="read-more-btn"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ways to travel dropdown */}
            <div
              className="dropdown"
              onMouseEnter={() => setShowWaysToTravel(true)}
              onMouseLeave={() => setShowWaysToTravel(false)}
            >
              <span className="link-item">
                Ways to Travel <ChevronDown size={14} />
              </span>
              {showWaysToTravel && (
                <div className="mega-menu-ways">
                  <div className="mega-columns">
                    <div className="column">
                      <h4>Travel Types</h4>
                      <ul>
                        {travelTypes.map((t) => (
                          <li
                            key={t}
                            onClick={() => setActiveTravelType(t)}
                            className={
                              activeTravelType === t ? "active" : undefined
                            }
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column">
                      <h4>Top Options</h4>
                      <ul>
                        {(travelOptions[activeTravelType] || []).map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Deals dropdown */}
            <div
              className="dropdown"
              onMouseEnter={() => setShowDeals(true)}
              onMouseLeave={() => setShowDeals(false)}
            >
              <span className="link-item">
                Deals <ChevronDown size={14} />
              </span>
              {showDeals && (
                <div className="mega-menu-deals">
                  <div className="mega-columns">
                    <div className="column">
                      <h4>Deals</h4>
                      <ul>
                        {dealCategories.map((d) => (
                          <li
                            key={d}
                            onClick={() => setActiveDealCategory(d)}
                            className={
                              activeDealCategory === d ? "active" : undefined
                            }
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="column">
                      <h4>Top Offers</h4>
                      <ul>
                        {(dealItems[activeDealCategory] || []).map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="link-item plain-link">
              About&nbsp;Us
            </Link>
          </nav>

          {/* desktop icons */}
          <div className="navbar-icons">
            {showSearchIcon && (
              <button
                className="search-icon"
                onClick={() => setShowSearchBar((p) => !p)}
              >
                <Search size={20} />
              </button>
            )}
            <button className="language-btn">
              <IoLanguage size={20} />
            </button>
            <Heart size={20} className="nav-icon" />
            <div className="profile-dropdown">
              <User
                size={20}
                className="nav-icon"
                onClick={() => setShowProfile(!showProfile)}
              />
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
            <button className="contact-btn">Contact&nbsp;Us</button>
          </div>
        </div>

        {showSearchBar && (
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search destinations, deals..."
              autoFocus
            />
            <button
              onClick={() => setShowSearchBar(false)}
              className="search-close-btn"
            >
              ×
            </button>
          </div>
        )}
      </header>

      {/* ---------------- MOBILE DRAWER ---------------- */}
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
              <ChevronLeft size={20} />
              Back
            </button>
          )}
          {mobileView === "main" && <span />}
          <button
            className="mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        {/* MAIN */}
        {mobileView === "main" && (
          <ul className="mobile-menu-list">
            <li onClick={() => setMobileView("destinations")}>
              Destinations <ChevronRight size={18} />
            </li>
            <li onClick={() => setMobileView("ways")}>
              Ways&nbsp;to&nbsp;travel <ChevronRight size={18} />
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
              <Heart size={18} />
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="with-icon"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <User size={18} />
              <Link
                to="/manage-booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="with-icon"
              >
                Manage&nbsp;booking
              </Link>
            </li>
            <li>
              <Phone size={18} />
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="with-icon"
              >
                Contact&nbsp;us
              </Link>
            </li>
          </ul>
        )}

        {/* REGIONS */}
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
                  {r}
                  <ChevronRight size={18} />
                </li>
              ))}
            </ul>
          </>
        )}

        {/* COUNTRIES */}
        {mobileView === "countries" && (
          <>
            <h2 className="mobile-subtitle">{mobileActiveRegion}</h2>
            <ul className="mobile-menu-list sub">
              {(countriesByRegion[mobileActiveRegion] || []).map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/destinations/${c.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* WAYS */}
        {mobileView === "ways" && (
          <>
            <h2 className="mobile-subtitle">Ways to travel</h2>
            <ul className="mobile-menu-list sub">
              {travelTypes.map((t) => (
                <li key={t}>
                  <Link
                    to={`/ways-to-travel/${t.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* DEALS */}
        {mobileView === "deals" && (
          <>
            <h2 className="mobile-subtitle">Deals</h2>
            <ul className="mobile-menu-list sub">
              {dealCategories.map((d) => (
                <li key={d}>
                  <Link
                    to={`/deals/${d.toLowerCase()}`}
                    onClick={() => setIsMobileMenuOpen(false)}
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
