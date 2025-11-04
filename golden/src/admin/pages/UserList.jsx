import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./user.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "admin-dashboard/users/";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_URL);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Make sure you are logged in as admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`${API_URL}${id}/`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  const handleDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <div className="user-container">
      <h2>User Management</h2>

      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th className="desktop-only">Username</th>
            <th className="desktop-only">Phone</th>
            <th className="desktop-only">Nationality</th>
            <th className="desktop-only">Profile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td className="desktop-only">{u.username}</td>
              <td className="desktop-only">{u.phone}</td>
              <td className="desktop-only">{u.nationality}</td>
              <td className="desktop-only">
                {u.profile_image && (
                  <img src={u.profile_image} alt="profile" className="profile-img" />
                )}
              </td>
              <td>
                <button onClick={() => handleDetails(u)} className="details-btn">
                  Details
                </button>
                <button onClick={() => handleDelete(u.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details Modal */}
      {showDetails && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Nationality:</strong> {selectedUser.nationality}</p>
            {selectedUser.profile_image && (
              <img src={selectedUser.profile_image} alt="profile" className="profile-img-modal" />
            )}
            <button className="cancel-btn" onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
