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
  Flag,
  CalendarCheck,
  Tag,
} from "lucide-react";
import "./sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

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

          {/* Added Newsletter link here */}
          <Link
            to="/admin/Newsletter"
            onClick={closeSidebar}
            className={`nav-item ${
              isActive("/admin/Newsletter") ? "active" : ""
            }`}
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
            to="/admin/contacts"
            onClick={closeSidebar}
            className={`nav-item ${
              isActive("/admin/contacts") ? "active" : ""
            }`}
          >
            <Mail size={18} /> Contacts
          </Link>
          <Link
            to="/admin/bookings"
            onClick={closeSidebar}
            className={`nav-item ${
              isActive("/admin/bookings") ? "active" : ""
            }`}
          >
            <Plane size={18} /> Bookings
          </Link>
          <Link
            to="/admin/regions"
            onClick={closeSidebar}
            className={`nav-item ${isActive("/admin/regions") ? "active" : ""}`}
          >
            <Globe size={18} /> Regions
          </Link>
          <Link
            to="/admin/countries"
            onClick={closeSidebar}
            className={`nav-item ${
              isActive("/admin/countries") ? "active" : ""
            }`}
          >
            <Flag size={18} /> Countries
          </Link>
          <Link
            to="/admin/travel-deals"
            onClick={closeSidebar}
            className={`nav-item ${
              isActive("/admin/travel-deals") ? "active" : ""
            }`}
          >
            <Tag size={18} /> Travel Deals
          </Link>
          <Link
            to="/admin/travel-deal-dates"
            onClick={closeSidebar}
            className={`nav-item ${
              isActive("/admin/travel-deal-dates") ? "active" : ""
            }`}
          >
            <CalendarCheck size={18} /> Deal Dates
          </Link>
        </nav>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Sidebar;
