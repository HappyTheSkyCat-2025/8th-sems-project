import React, { useEffect, useState } from "react";
import { getRegions, deleteRegion, createRegion, updateRegion, getRegion } from "../api/regionApi";
import RegionForm from "../components/RegionForm";
import "./region.css"; // Optional: add your own CSS file

const RegionList = () => {
  const [regions, setRegions] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const fetchRegions = async (url = null) => {
    try {
      const res = await getRegions(url || undefined); // Pass null as undefined to default to base URL
      setRegions(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch regions", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this region?")) {
      try {
        await deleteRegion(id);
        fetchRegions(); // Refresh the list
      } catch (err) {
        console.error("Failed to delete region", err);
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedRegion && selectedRegion.id) {
        await updateRegion(selectedRegion.id, data);
      } else {
        await createRegion(data);
      }
      setShowForm(false);
      setSelectedRegion(null);
      fetchRegions();
    } catch (err) {
      console.error("Failed to save region", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await getRegion(id);
      setSelectedRegion(res.data);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load region", err);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <div>
      <h2>Region Management</h2>
      <button
        className="create-btn"
        onClick={() => {
          setSelectedRegion(null);
          setShowForm(true);
        }}
      >
        + Create Region
      </button>

      <table className="region-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>
                <button onClick={() => handleEdit(r.id)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(r.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {previous && (
          <button onClick={() => fetchRegions(previous)}>← Previous</button>
        )}
        {next && <button onClick={() => fetchRegions(next)}>Next →</button>}
      </div>

      {showForm && (
        <RegionForm
          region={selectedRegion}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default RegionList;
