import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./country.css";

const CountryOverview = () => {
  const [overviews, setOverviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState({
    id: null,
    country_id: "",
    capital: "",
    population: "",
    currency: "",
    language: "",
    timezone: "",
    calling_code: "",
    electricity: "",
  });

  // 🔹 Fetch overviews + countries
  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, countryRes] = await Promise.all([
        axiosInstance.get("admin-dashboard/country-overviews/"),
        axiosInstance.get("admin-dashboard/countries/"),
      ]);
      setOverviews(overviewRes.data.results || overviewRes.data);
      setCountries(countryRes.data.results || countryRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      alert("❌ Failed to fetch country overview data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setCurrent({
      id: null,
      country_id: "",
      capital: "",
      population: "",
      currency: "",
      language: "",
      timezone: "",
      calling_code: "",
      electricity: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent({
      id: item.id,
      country_id: item.country?.id || item.country_id || "",
      capital: item.capital || "",
      population: item.population || "",
      currency: item.currency || "",
      language: item.language || "",
      timezone: item.timezone || "",
      calling_code: item.calling_code || "",
      electricity: item.electricity || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save overview
  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(current).forEach(([key, val]) => {
        if (val !== "" && val !== null && key !== "id") formData.append(key, val);
      });

      const url = current.id
        ? `admin-dashboard/country-overviews/${current.id}/`
        : "admin-dashboard/country-overviews/";
      const method = current.id ? "put" : "post";

      await axiosInstance({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchData();
      setModalOpen(false);
      alert("✅ Country overview saved!");
    } catch (err) {
      console.error("Failed to save:", err.response?.data || err);
      alert("❌ Failed to save country overview.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this overview?")) return;
    try {
      await axiosInstance.delete(`admin-dashboard/country-overviews/${id}/`);
      setOverviews((prev) => prev.filter((item) => item.id !== id));
      alert("🗑️ Overview deleted!");
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("❌ Failed to delete overview.");
    }
  };

  if (loading) return <p>Loading country overviews...</p>;

  return (
    <div className="country-container">
      <div className="country-header">
        <h2>🌍 Country Overview</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add Overview
        </button>
      </div>
      <p>Manage country-specific overview details like capital, language, and more.</p>

      <div className="country-table-wrapper">
        <table className="country-table">
          <thead>
            <tr>
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
            {overviews.map((item) => (
              <tr key={item.id}>
                <td>{item.country?.name || "—"}</td>
                <td className="hide-mobile">{item.capital}</td>
                <td className="hide-mobile">{item.population}</td>
                <td className="hide-mobile">{item.currency}</td>
                <td className="hide-mobile">{item.language}</td>
                <td className="hide-mobile">{item.timezone}</td>
                <td className="hide-mobile">{item.calling_code}</td>
                <td className="hide-mobile">{item.electricity}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
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
          <div
            className="modal-content fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{current.id ? "Edit Country Overview" : "Add Country Overview"}</h3>

            <div className="floating-form">
              <div className="floating-label-group">
                <select
                  name="country_id"
                  value={current.country_id}
                  onChange={handleChange}
                  required
                  className="floating-input"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <label className={current.country_id ? "filled" : ""}>COUNTRY</label>
              </div>

              {[
                "capital",
                "population",
                "currency",
                "language",
                "timezone",
                "calling_code",
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
                    {field.replace("_", " ").toUpperCase()}
                  </label>
                </div>
              ))}

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

export default CountryOverview;
