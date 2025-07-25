import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, createUser, updateUser, getUser } from "../api/userApi";
import UserForm from "../components/UserForm";
import "./user.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (url = null) => {
    try {
      const res = await getUsers(url);
      setUsers(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await updateUser(data.id, data);
      } else {
        await createUser(data);
      }
      setShowForm(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Failed to save user", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await getUser(id);
      setSelectedUser(res.data);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load user", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User Management</h2>
      <button className="create-btn" onClick={() => { setSelectedUser(null); setShowForm(true); }}>
        + Create User
      </button>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Staff</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.phone}</td>
              <td>{u.is_staff ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(u.id)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(u.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {previous && <button onClick={() => fetchUsers(previous)}>← Previous</button>}
        {next && <button onClick={() => fetchUsers(next)}>Next →</button>}
      </div>

      {showForm && (
        <UserForm user={selectedUser} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default UserList;
