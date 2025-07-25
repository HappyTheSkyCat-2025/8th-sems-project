import React, { useState, useEffect } from "react";

const UserForm = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone: "",
    nationality: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
  });

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{user ? "Edit User" : "Create User"}</h3>
        <form onSubmit={handleSubmit}>
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Phone" />
          <input name="nationality" value={formData.nationality || ""} onChange={handleChange} placeholder="Nationality" />

          <label>
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            Active
          </label>
          <label>
            <input type="checkbox" name="is_staff" checked={formData.is_staff} onChange={handleChange} />
            Staff
          </label>
          <label>
            <input type="checkbox" name="is_superuser" checked={formData.is_superuser} onChange={handleChange} />
            Superuser
          </label>

          <button type="submit">{user ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
