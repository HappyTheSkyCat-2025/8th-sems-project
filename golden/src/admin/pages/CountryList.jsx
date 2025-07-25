import React, { useEffect, useState } from "react";
import {
  getCountries,
  deleteCountry,
} from "../api/countryApi";
import CountryForm from "../components/CountryForm";
import "./country.css";

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const fetchCountries = async (url = null) => {
    try {
      const res = await getCountries(url || undefined);
      setCountries(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch countries", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      try {
        await deleteCountry(id);
        fetchCountries();
      } catch (err) {
        console.error("Failed to delete country", err);
      }
    }
  };

  const handleEdit = (country) => {
    setSelectedCountry(country);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedCountry(null);
    fetchCountries();
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div>
      <h2>Country Management</h2>
      <button
        className="create-btn"
        onClick={() => {
          setSelectedCountry(null);
          setShowForm(true);
        }}
      >
        + Create Country
      </button>

      <table className="country-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Currency Code</th>
            <th>Slug</th>
            <th>Region</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.code}</td>
              <td>{c.currency_code}</td>
              <td>{c.slug}</td>
              <td>{c.region?.name || "-"}</td>
              <td>
                <button
                  onClick={() => handleEdit(c)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {previous && (
          <button onClick={() => fetchCountries(previous)}>← Previous</button>
        )}
        {next && (
          <button onClick={() => fetchCountries(next)}>Next →</button>
        )}
      </div>

      {showForm && (
        <CountryForm
          country={selectedCountry}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CountryList;
