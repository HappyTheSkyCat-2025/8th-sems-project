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
        <Link className="nav-link" to="/admin/contacts">contacts</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
