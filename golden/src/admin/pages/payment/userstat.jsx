import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./userstat.css";

const UserStatus = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/bookings/");
      const data = (Array.isArray(res.data) ? res.data : res.data.results || []).map(
        (b) => ({
          id: b.id,
          name: b.full_name || `${b.user?.first_name} ${b.user?.last_name}` || "—",
          email: b.email || b.user?.email || "—",
          phone: b.phone || "—",
          address1: b.address_line1 || "—",
          address2: b.address_line2 || "—",
          state: b.state || "—",
          postalCode: b.postcode || "—",
          country: b.country || "—",
        })
      );
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(`/admin-dashboard/bookings/${id}/`);
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleDetails = (user) => setSelectedUser(user);
  const closeDetails = () => setSelectedUser(null);

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
            {users.length ? (
              users.map((user) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
