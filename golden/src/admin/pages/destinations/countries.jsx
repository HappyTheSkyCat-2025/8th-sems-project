import React, { useState } from "react";
import "./countries.css";

const Countries = () => {
  const [countries, setCountries] = useState([
    {
      id: 1,
      region: "South Asia",
      name: "Nepal",
      code: "NP",
      currencyCode: "NPR",
      title: "Land of Himalayas",
      description: "Known for its diverse geography and Mount Everest.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: 2,
      region: "Europe",
      name: "France",
      code: "FR",
      currencyCode: "EUR",
      title: "Romantic Escape",
      description: "Famous for Paris, wine, and art culture.",
      image:
        "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg",
      video: "https://www.w3schools.com/html/movie.mp4",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    region: "",
    name: "",
    code: "",
    currencyCode: "",
    title: "",
    description: "",
    image: "",
    video: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const openAddModal = () => {
    setCurrent({
      id: null,
      region: "",
      name: "",
      code: "",
      currencyCode: "",
      title: "",
      description: "",
      image: "",
      video: "",
    });
    setImagePreview("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent(item);
    setImagePreview(item.image);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrent((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (current.id) {
      setCountries((prev) =>
        prev.map((c) => (c.id === current.id ? current : c))
      );
    } else {
      setCountries((prev) => [...prev, { ...current, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setCountries(countries.filter((c) => c.id !== id));
  };

  return (
    <div className="countries-container">
      <div className="countries-header">
        <h2>🗺️ Countries</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add Country
        </button>
      </div>
      <p>Overview and listing of all available travel countries.</p>

      <div className="table-container">
        <table className="countries-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Name</th>
              <th>Code</th>
              <th>Currency Code</th>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th>Video</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.id}>
                <td>{c.region}</td>
                <td>{c.name}</td>
                <td>{c.code}</td>
                <td>{c.currencyCode}</td>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>
                  <img src={c.image} alt={c.name} className="circle-img" />
                </td>
                <td>
                  <a
                    href={c.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-link"
                  >
                    🎥 View
                  </a>
                </td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => openEditModal(c)}
                  >
                    Details
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{current.id ? "Edit Country" : "Add Country"}</h3>

            {[
              { label: "Region", name: "region" },
              { label: "Name", name: "name" },
              { label: "Code", name: "code" },
              { label: "Currency Code", name: "currencyCode" },
              { label: "Title", name: "title" },
              { label: "Description", name: "description" },
              { label: "Video URL", name: "video" },
            ].map((field) => (
              <div className="form-group floating" key={field.name}>
                <input
                  type="text"
                  name={field.name}
                  value={current[field.name]}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label>{field.label}</label>
              </div>
            ))}

            {/* File Upload for Image */}
            <div className="form-group upload-section">
              <label className="upload-label">Add Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              )}
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countries;
