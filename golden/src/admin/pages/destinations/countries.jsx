import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./countries.css";

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    region: null,
    name: "",
    code: "",
    currency_code: "",
    subtitle: "",
    section_title: "",
    description: "",
    image: null,
    video: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  // Fetch regions for dropdown
  const fetchRegions = async () => {
    try {
      const res = await axiosInstance.get("admin-dashboard/regions/");
      setRegions(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load regions", err);
    }
  };

  // Fetch countries
  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("admin-dashboard/countries/");
      setCountries(res.data.results || res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load countries. Are you an admin?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
    fetchCountries();
  }, []);

  const openAddModal = () => {
    setCurrent({
      id: null,
      region: null,
      name: "",
      code: "",
      currency_code: "",
      subtitle: "",
      section_title: "",
      description: "",
      image: null,
      video: null,
    });
    setImagePreview("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent({
      ...item,
      region: item.region,
      image: null, // reset file input
      video: null,
    });
    setImagePreview(item.image || "");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e) => {
    const regionId = parseInt(e.target.value);
    const regionObj = regions.find((r) => r.id === regionId) || null;
    setCurrent((prev) => ({ ...prev, region: regionObj }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrent((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrent((prev) => ({ ...prev, video: file }));
    }
  };

  const handleSave = async () => {
    if (!current.name || !current.region) {
      alert("Please provide name and select a region.");
      return;
    }

    const formData = new FormData();
    formData.append("name", current.name);
    formData.append("code", current.code || "");
    formData.append("currency_code", current.currency_code || "");
    formData.append("subtitle", current.subtitle || "");
    formData.append("section_title", current.section_title || "");
    formData.append("description", current.description || "");
    if (current.video) formData.append("video", current.video);
    if (current.image) formData.append("image", current.image);
    formData.append("region_id", current.region.id); // send ID

    try {
      if (current.id) {
        await axiosInstance.put(
          `admin-dashboard/countries/${current.id}/`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await axiosInstance.post("admin-dashboard/countries/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchCountries();
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save country", err.response?.data || err);
      alert("Failed to save country. Check all fields.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      try {
        await axiosInstance.delete(`admin-dashboard/countries/${id}/`);
        setCountries(countries.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Failed to delete country", err);
        alert("Failed to delete country.");
      }
    }
  };

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
              <th>Currency</th>
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
                <td>{c.region?.name}</td>
                <td>{c.name}</td>
                <td>{c.code}</td>
                <td>{c.currency_code}</td>
                <td>{c.section_title || c.subtitle}</td>
                <td>{c.description}</td>
                <td>
                  {c.image && (
                    <img src={c.image} alt={c.name} className="circle-img" />
                  )}
                </td>
                <td>
                  {c.video ? (
                    <a
                      href={c.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link"
                    >
                      🎥 View
                    </a>
                  ) : (
                    "N/A"
                  )}
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

            <div className="form-group">
              <label>Region</label>
              <select
                value={current.region?.id || ""}
                onChange={handleRegionChange}
              >
                <option value="">Select Region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {[
              { label: "Name", name: "name" },
              { label: "Code", name: "code" },
              { label: "Currency Code", name: "currency_code" },
              { label: "Subtitle", name: "subtitle" },
              { label: "Section Title", name: "section_title" },
              { label: "Description", name: "description" },
            ].map((field) => (
              <div className="form-group floating" key={field.name}>
                <input
                  type="text"
                  name={field.name}
                  value={current[field.name] || ""}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>{field.label}</label>
              </div>
            ))}

            <div className="form-group">
              <label>Video URL / Upload</label>
              <input type="file" accept="video/*" onChange={handleVideoChange} />
              {current.video && typeof current.video === "string" && (
                <a href={current.video} target="_blank" rel="noopener noreferrer">
                  🎥 Current Video
                </a>
              )}
            </div>

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
