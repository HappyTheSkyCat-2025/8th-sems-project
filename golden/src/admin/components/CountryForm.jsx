import React, { useState, useEffect } from "react";
import { createCountry, updateCountry } from "../api/countryApi";
import { getRegions } from "../api/regionApi";

const CountryForm = ({ country, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    currency_code: "",
    slug: "",
    region: "",
  });

  const [regions, setRegions] = useState([]);

  useEffect(() => {
    getRegions().then((res) => setRegions(res.data.results));
  }, []);

  useEffect(() => {
    if (country) {
      setFormData({
        name: country.name || "",
        code: country.code || "",
        currency_code: country.currency_code || "",
        slug: country.slug || "",
        region: country.region?.id || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        currency_code: "",
        slug: "",
        region: "",
      });
    }
  }, [country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (country) {
        await updateCountry(country.id, formData);
      } else {
        await createCountry(formData);
      }
      onSave();
    } catch (err) {
      console.error("Failed to save country", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{country ? "Edit Country" : "Create Country"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </label>

          <label>
            Code:
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Currency Code:
            <input
              name="currency_code"
              value={formData.currency_code}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Slug:
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Region:
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select region
              </option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-buttons">
            <button type="submit">{country ? "Update" : "Create"}</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CountryForm;
