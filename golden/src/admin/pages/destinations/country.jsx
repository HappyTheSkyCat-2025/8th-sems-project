import React, { useState } from "react";
import "./country.css";

const Country = () => {
  const [countries, setCountries] = useState([
    {
      id: 1,
      country: "Nepal",
      capital: "Kathmandu",
      population: "30 million",
      currency: "Nepalese Rupee (NPR)",
      language: "Nepali",
      timezone: "GMT+5:45",
      callingCode: "+977",
      electricity: "230V / 50Hz",
      image: null,
    },
    {
      id: 2,
      country: "Japan",
      capital: "Tokyo",
      population: "125 million",
      currency: "Japanese Yen (JPY)",
      language: "Japanese",
      timezone: "GMT+9",
      callingCode: "+81",
      electricity: "100V / 50-60Hz",
      image: null,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    country: "",
    capital: "",
    population: "",
    currency: "",
    language: "",
    timezone: "",
    callingCode: "",
    electricity: "",
    image: null,
  });

  const openAddModal = () => {
    setCurrent({
      id: null,
      country: "",
      capital: "",
      population: "",
      currency: "",
      language: "",
      timezone: "",
      callingCode: "",
      electricity: "",
      image: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent(item);
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
      const imageUrl = URL.createObjectURL(file);
      setCurrent((prev) => ({ ...prev, image: imageUrl }));
    }
  };

  const handleSave = () => {
    if (current.id) {
      setCountries((prev) =>
        prev.map((item) => (item.id === current.id ? current : item))
      );
    } else {
      setCountries((prev) => [
        ...prev,
        { ...current, id: Date.now() },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setCountries((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="country-container">
      <div className="country-header">
        <h2>🌍 Country</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add Details
        </button>
      </div>
      <p>Manage specific country details and travel highlights.</p>

      <div className="country-table-wrapper">
        <table className="country-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Country</th>
              <th className="hide-mobile">Capital</th>
              <th className="hide-mobile">Population</th>
              <th className="hide-mobile">Currency</th>
              <th className="hide-mobile">Language</th>
              <th className="hide-mobile">Time Zone</th>
              <th className="hide-mobile">Calling Code</th>
              <th className="hide-mobile">Electricity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.country}
                      className="country-img"
                    />
                  ) : (
                    <span className="no-img">No Image</span>
                  )}
                </td>
                <td>{item.country}</td>
                <td className="hide-mobile">{item.capital}</td>
                <td className="hide-mobile">{item.population}</td>
                <td className="hide-mobile">{item.currency}</td>
                <td className="hide-mobile">{item.language}</td>
                <td className="hide-mobile">{item.timezone}</td>
                <td className="hide-mobile">{item.callingCode}</td>
                <td className="hide-mobile">{item.electricity}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => openEditModal(item)}
                  >
                    Details
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
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
          <div className="modal-content fadeIn" onClick={(e) => e.stopPropagation()}>
            <h3>{current.id ? "Edit Country" : "Add Country"}</h3>

            <div className="floating-form">
              {[
                "country",
                "capital",
                "population",
                "currency",
                "language",
                "timezone",
                "callingCode",
                "electricity",
              ].map((field) => (
                <div className="floating-label-group" key={field}>
                  <input
                    type="text"
                    name={field}
                    value={current[field]}
                    onChange={handleChange}
                    required
                    className="floating-input"
                  />
                  <label className={current[field] ? "filled" : ""}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                </div>
              ))}

              <div className="image-upload">
                <label>Add Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {current.image && (
                  <img src={current.image} alt="Preview" className="preview-img" />
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
        </div>
      )}
    </div>
  );
};

export default Country;
