import React, { useState, useEffect } from "react";

const RegionForm = ({ region, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (region) {
      setFormData({ name: region.name || "" });
    } else {
      setFormData({ name: "" });
    }
  }, [region]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{region ? "Edit Region" : "Create Region"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </label>

          <button type="submit">{region ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegionForm;
