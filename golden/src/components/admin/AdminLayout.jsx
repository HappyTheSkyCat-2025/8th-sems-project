// src/components/admin/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaGlobe, FaMapMarkedAlt, FaSignOutAlt, FaSuitcase } from "react-icons/fa";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <FaGlobe /> },
  { to: "regions", label: "Regions", icon: <FaMapMarkedAlt /> },
  { to: "countries", label: "Countries", icon: <FaSuitcase /> },
  // Add more links as needed:
  // { to: "travel-deals", label: "Travel Deals", icon: <FaStar /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens and any user info from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div
      className="admin-dashboard"
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          backgroundColor: "#232741",
          color: "#f0f2f5",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1.5rem",
          position: "fixed",
          height: "100vh",
          boxShadow: "2px 0 12px rgba(0,0,0,0.1)",
          userSelect: "none",
        }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: "700",
            marginBottom: "2rem",
            letterSpacing: "1px",
            color: "#ffd05b",
            textAlign: "center",
          }}
        >
          🌐 Admin Panel
        </h2>

        <nav style={{ flexGrow: 1 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {navItems.map(({ to, label, icon }) => (
              <li key={to} style={{ marginBottom: "1.25rem" }}>
                <NavLink
                  to={to}
                  end={to === "/admin"}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem 1.25rem",
                    borderRadius: 8,
                    color: isActive ? "#232741" : "#b0b5c1",
                    backgroundColor: isActive ? "#ffd05b" : "transparent",
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: "none",
                    boxShadow: isActive
                      ? "0 4px 8px rgba(255, 208, 91, 0.4)"
                      : "none",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                    userSelect: "none",
                  })}
                  title={label}
                >
                  <span
                    style={{
                      fontSize: 20,
                      marginRight: 14,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {icon}
                  </span>
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            backgroundColor: "#e53935",
            border: "none",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e53935")}
          title="Logout"
          type="button"
        >
          <FaSignOutAlt style={{ marginRight: 8 }} />
          Logout
        </button>

        <footer
          style={{
            fontSize: 12,
            textAlign: "center",
            color: "#646f8a",
            marginTop: 20,
            paddingTop: 10,
            borderTop: "1px solid #383e56",
            userSelect: "none",
          }}
        >
          &copy; {new Date().getFullYear()} Golden Leaf Travels
        </footer>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: 260,
          flexGrow: 1,
          padding: "2rem 3rem",
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: "2rem 2.5rem",
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
            minHeight: "80vh",
          }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
