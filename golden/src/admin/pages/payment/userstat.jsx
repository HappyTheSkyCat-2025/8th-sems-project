import React, { useState } from "react";
import "./userstat.css";

const UserStatus = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dipesh Thapa Magar",
      email: "dipesh@example.com",
      phone: "+977-9800000000",
      address1: "123 Main Street",
      address2: "Apt 5B",
      state: "Bagmati",
      postalCode: "44600",
      country: "Nepal",
    },
    {
      id: 2,
      name: "Yadap Thapa",
      email: "yadap@example.com",
      phone: "+977-9811111111",
      address1: "456 Lakeside Road",
      address2: "Suite 210",
      state: "Gandaki",
      postalCode: "33700",
      country: "Nepal",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(null);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleDetails = (user) => {
    setSelectedUser(user);
  };

  const closeDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className="userstat-container">
      <h2 className="userstat-title">👤 User Details & Status</h2>
      <p className="userstat-desc">Manage user profiles, addresses, and actions.</p>

      <div className="userstat-table-wrapper">
        <table className="userstat-table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hide-mobile">Email</th>
              <th className="hide-mobile">Phone</th>
              <th className="hide-mobile">Address Line 1</th>
              <th className="hide-mobile">Address Line 2</th>
              <th className="hide-mobile">State</th>
              <th className="hide-mobile">Post Code</th>
              <th className="hide-mobile">Country</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td className="hide-mobile">{user.email}</td>
                <td className="hide-mobile">{user.phone}</td>
                <td className="hide-mobile">{user.address1}</td>
                <td className="hide-mobile">{user.address2}</td>
                <td className="hide-mobile">{user.state}</td>
                <td className="hide-mobile">{user.postalCode}</td>
                <td className="hide-mobile">{user.country}</td>
                <td>
                  <button
                    className="btn-details"
                    onClick={() => handleDetails(user)}
                  >
                    Details
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedUser && (
        <div className="userstat-modal-overlay" onClick={closeDetails}>
          <div
            className="userstat-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedUser.name}</h3>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Address Line 1:</strong> {selectedUser.address1}</p>
            <p><strong>Address Line 2:</strong> {selectedUser.address2}</p>
            <p><strong>State:</strong> {selectedUser.state}</p>
            <p><strong>Post Code:</strong> {selectedUser.postalCode}</p>
            <p><strong>Country:</strong> {selectedUser.country}</p>
            <button className="btn-close" onClick={closeDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatus;
