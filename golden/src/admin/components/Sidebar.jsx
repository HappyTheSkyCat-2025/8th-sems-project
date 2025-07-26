import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h5>Admin Menu</h5>
      <nav>
        <Link className="nav-link" to="/admin">Dashboard</Link>
        <Link className="nav-link" to="/admin/users">Users</Link>
        <Link className="nav-link" to="/admin/blogs">Blogs</Link>
        <Link className="nav-link" to="/admin/contacts">Contacts</Link>
        <Link className="nav-link" to="/admin/bookings">Bookings</Link> 
        <Link className="nav-link" to="/admin/regions">Regions</Link>
        <Link className="nav-link" to="/admin/countries">Countries</Link>
        <Link className="nav-link" to="/admin/travel-deals">Travel Deals</Link>
        <Link className="nav-link" to="/admin/travel-deal-dates">Travel Deal Dates</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
