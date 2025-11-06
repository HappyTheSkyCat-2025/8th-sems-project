import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({ id: null, name: "", image: "", file: null });

  // Fetch places from API
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/places/");
      const placeList = Array.isArray(res.data) ? res.data : res.data.results;
      setPlaces(placeList || []);
    } catch (error) {
      console.error("Failed to load places:", error);
      setPlaces([]);
    }
  };

  const openAddModal = () => {
    setCurrent({ id: null, name: "", image: "", file: null });
    setModalOpen(true);
  };

  const openEditModal = (place) => {
    setCurrent({
      id: place.id,
      name: place.name,
      image: place.image,
      file: null, // start with no file selected for editing
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrent((prev) => ({
        ...prev,
        file, // actual file for FormData
        image: URL.createObjectURL(file), // preview
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", current.name);

      if (current.file) {
        formData.append("image", current.file);
      }

      if (current.id) {
        await axiosInstance.put(
          `/admin-dashboard/places/${current.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axiosInstance.post(
          "/admin-dashboard/places/",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      setModalOpen(false);
      fetchPlaces();
    } catch (error) {
      console.error("Failed to save place:", error.response?.data || error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this place?")) return;
    try {
      await axiosInstance.delete(`/admin-dashboard/places/${id}/`);
      fetchPlaces();
    } catch (error) {
      console.error("Failed to delete place:", error);
    }
  };

  return (
    <div className="places-container">
      <style>{`
        .places-container { padding: 20px; }
        .places-header { display: flex; justify-content: space-between; align-items: center; }
        .add-btn { background-color: #2563eb; color: white; border: none; border-radius: 6px; padding: 8px 14px; cursor: pointer; font-size: 14px; transition: 0.3s; }
        .add-btn:hover { background-color: #1d4ed8; }
        .places-table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; border-radius: 8px; overflow: hidden; }
        .places-table th, .places-table td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; vertical-align: middle; }
        .places-table th { background-color: #f1f5f9; font-weight: bold; }
        .places-table img { width: 80px; height: 60px; border-radius: 6px; object-fit: cover; }
        .edit-btn { background-color: #16a34a; color: white; border: none; border-radius: 5px; padding: 6px 10px; cursor: pointer; margin-right: 6px; transition: 0.3s; }
        .edit-btn:hover { background-color: #15803d; }
        .delete-btn { background-color: #dc2626; color: white; border: none; border-radius: 5px; padding: 6px 10px; cursor: pointer; transition: 0.3s; }
        .delete-btn:hover { background-color: #b91c1c; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.45); display: flex; justify-content: center; align-items: center; z-index: 999; }
        .modal-content { background: #fff; padding: 25px; border-radius: 12px; width: 90%; max-width: 420px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); animation: fadeIn 0.3s ease-in-out; }
        .modal-content h3 { text-align: center; margin-bottom: 15px; }
        .form-group { position: relative; margin-top: 18px; }
        .form-group input { width: 100%; padding: 12px 10px 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 6px; outline: none; transition: 0.2s; background: transparent; }
        .form-group input:focus { border-color: #2563eb; }
        .form-group label { position: absolute; top: 50%; left: 10px; color: #888; transform: translateY(-50%); font-size: 14px; pointer-events: none; transition: 0.2s ease all; background: white; padding: 0 4px; }
        .form-group input:focus + label, .form-group input:not(:placeholder-shown) + label { top: 0; font-size: 12px; color: #2563eb; }
        .photo-preview { margin-top: 10px; text-align: center; }
        .photo-preview img { width: 100px; height: 100px; border-radius: 8px; object-fit: cover; }
        .modal-buttons { display: flex; justify-content: space-between; margin-top: 20px; }
        .save-btn, .close-btn { padding: 8px 16px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; transition: 0.3s ease; }
        .save-btn { background-color: #16a34a; color: white; }
        .save-btn:hover { background-color: #15803d; }
        .close-btn { background-color: #9ca3af; color: white; }
        .close-btn:hover { background-color: #6b7280; }
        @keyframes fadeIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div className="places-header">
        <h2>📍 Places</h2>
        <button className="add-btn" onClick={openAddModal}>+ Add Place</button>
      </div>

      <p>Highlight popular tourist spots and unique travel destinations.</p>

      <table className="places-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Photo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(places) && places.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td><img src={p.image} alt={p.name} /></td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(p)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{current.id ? "Edit Place" : "Add Place"}</h3>

            <div className="form-group">
              <input
                type="text"
                name="name"
                value={current.name}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Place Name</label>
            </div>

            <div className="form-group">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </div>

            {current.image && (
              <div className="photo-preview">
                <img src={current.image} alt="Preview" />
              </div>
            )}

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="close-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
