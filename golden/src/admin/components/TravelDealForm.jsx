import React, { useState, useEffect } from "react";
import { createTravelDeal, updateTravelDeal } from "../api/travelDealApi";
import { getCountries } from "../api/countryApi";
import { getDealCategories } from "../api/dealCategoryApi"; // optional, if available

const TravelDealForm = ({ travelDeal, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    country_id: "",   // use *_id here
    category_id: "",
  });

  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getCountries()
      .then((res) => setCountries(res.data.results))
      .catch(() => setCountries([]));
    getDealCategories()
      .then((res) => setCategories(res.data.results))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (travelDeal) {
      setFormData({
        title: travelDeal.title || "",
        price: travelDeal.price || "",
        country_id: travelDeal.country?.id || "",
        category_id: travelDeal.category?.id || "",
      });
    } else {
      setFormData({
        title: "",
        price: "",
        country_id: "",
        category_id: "",
      });
    }
  }, [travelDeal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      if (travelDeal) {
        await updateTravelDeal(travelDeal.id, formData);
      } else {
        await createTravelDeal(formData);
      }
      onSave();
    } catch (err) {
      if (err.response) {
        setErrorMsg(JSON.stringify(err.response.data));
        console.error("API validation error:", err.response.data);
      } else {
        setErrorMsg("Unexpected error");
        console.error(err);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{travelDeal ? "Edit Travel Deal" : "Create Travel Deal"}</h3>
        {errorMsg && (
          <div style={{ color: "red", marginBottom: "10px", whiteSpace: "pre-wrap" }}>
            Error: {errorMsg}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </label>

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </label>

          <label>
            Country:
            <select
              name="country_id"
              value={formData.country_id}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Category:
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <div className="form-buttons">
            <button type="submit">{travelDeal ? "Update" : "Create"}</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelDealForm;
