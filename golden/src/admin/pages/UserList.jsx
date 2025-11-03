import React, { useState } from "react";
import "./user.css";

const initialUsers = [
  {
    id: 1,
    email: "john@example.com",
    username: "john123",
    phone: "1234567890",
    nationality: "USA",
    profile_image: "https://via.placeholder.com/50"
  },
  {
    id: 2,
    email: "emma@example.com",
    username: "emma98",
    phone: "9876543210",
    nationality: "UK",
    profile_image: "https://via.placeholder.com/50"
  },
  {
    id: 3,
    email: "liam@example.com",
    username: "liam007",
    phone: "5554443333",
    nationality: "Canada",
    profile_image: "https://via.placeholder.com/50"
  }
];

const UserList = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

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
                <img src={u.profile_image} alt="profile" className="profile-img" />
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
            <img
              src={selectedUser.profile_image}
              alt="profile"
              className="profile-img-modal"
            />
            <button className="cancel-btn" onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
