import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Mail,
  Plane,
  Globe,
  BookMarked,
  ChevronDown,
  CreditCard,
} from "lucide-react";
import "./sideBar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const toggleDropdown = (menu) =>
    setOpenDropdown(openDropdown === menu ? null : menu);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`custom-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>✈️ Travel Admin</h2>
          <p>Manage your journeys</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/admin"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin") ? "active" : ""}`}
          >
            <Home size={18} /> Dashboard
          </Link>

          <Link
            to="/admin/users"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin/users") ? "active" : ""}`}
          >
            <Users size={18} /> Users
          </Link>

          <Link
            to="/admin/Newsletter"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin/Newsletter") ? "active" : ""}`}
          >
            <Mail size={18} /> Newsletter
          </Link>

          <Link
            to="/admin/blogs"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin/blogs") ? "active" : ""}`}
          >
            <BookOpen size={18} /> Blogs
          </Link>

          <Link
            to="/admin/stories"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin/stories") ? "active" : ""}`}
          >
            <BookMarked size={18} /> Stories
          </Link>

          <Link
            to="/admin/bookings"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin/bookings") ? "active" : ""}`}
          >
            <Plane size={18} /> Bookings
          </Link>

          <Link
            to="/admin/contacts"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin/contacts") ? "active" : ""}`}
          >
            <Mail size={18} /> Contacts
          </Link>

          {/* Payments Dropdown */}
          <div className="dropdown-group no-gap">
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown("payments")}
            >
              <CreditCard size={18} />Payments
              <ChevronDown
                className={`chevron ${
                  openDropdown === "payments" ? "rotate" : ""
                }`}
                size={16}
              />
            </div>
            {openDropdown === "payments" && (
              <div className="dropdown-items single-line">
                <Link to="/admin/payment-method" onClick={closeSidebar}>
                  &gt; Payment Method
                </Link>
                <Link to="/admin/user-status" onClick={closeSidebar}>
                  &gt; User Status
                </Link>
                <Link to="/admin/booking-details" onClick={closeSidebar}>
                  &gt; Booking Details
                </Link>
              </div>
            )}
          </div>

          {/* Destinations Dropdown */}
          <div className="dropdown-group no-gap">
            <div
              className="dropdown-header"
              onClick={() => toggleDropdown("destinations")}
            >
              <Globe size={18} />Destinations
              <ChevronDown
                className={`chevron ${
                  openDropdown === "destinations" ? "rotate" : ""
                }`}
                size={16}
              />
            </div>
            {openDropdown === "destinations" && (
              <div className="dropdown-items single-line">
                <Link to="/admin/article" onClick={closeSidebar}>
                  &gt; Article
                </Link>
                <Link to="/admin/learn" onClick={closeSidebar}>
                  &gt; Learn
                </Link>
                <Link to="/admin/country" onClick={closeSidebar}>
                  &gt; Country
                </Link>
                <Link to="/admin/countries" onClick={closeSidebar}>
                  &gt; Countries
                </Link>
                <Link to="/admin/deal" onClick={closeSidebar}>
                  &gt; Deal
                </Link>
                <Link to="/admin/faq" onClick={closeSidebar}>
                  &gt; FAQ
                </Link>
                <Link to="/admin/places" onClick={closeSidebar}>
                  &gt; Places
                </Link>
                <Link to="/admin/region" onClick={closeSidebar}>
                  &gt; Region
                </Link>
                <Link to="/admin/reviews" onClick={closeSidebar}>
                  &gt; Reviews
                </Link>
                <Link to="/admin/travel-deals" onClick={closeSidebar}>
                  &gt; Travel Deals
                </Link>
                <Link to="/admin/travel-deal-dates" onClick={closeSidebar}>
                  &gt; Travel Deal Dates
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Sidebar;
