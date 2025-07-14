import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function FAQList() {
  const { country_slug } = useParams();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get(`/api/destinations/countries/${country_slug}/faqs/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.results || res.data;
        setFaqs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load FAQs:", err);
        setLoading(false);
      });
  }, [country_slug]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    const token = localStorage.getItem("access_token");
    axios
      .delete(`/api/destinations/countries/${country_slug}/faqs/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setFaqs((prev) => prev.filter((f) => f.id !== id)))
      .catch((err) => alert("Failed to delete: " + err.message));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600 }}>📌 FAQs for "{country_slug}"</h2>
        <Link to="create" style={btnCreate}>
          + New FAQ
        </Link>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <thead style={{ background: "#f7f7f7" }}>
          <tr>
            <th style={thStyle}>Question</th>
            <th style={thStyle}>Country</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <tr key={faq.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{faq.question.slice(0, 80)}...</td>
                <td style={tdStyle}>{faq.country}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <button onClick={() => navigate(`${faq.id}/edit`)} style={btnEdit}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(faq.id)} style={btnDelete}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: 20, color: "#777" }}>
                No FAQs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 16px",
  fontWeight: "600",
  fontSize: "14px",
  color: "#333",
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: "14px",
  color: "#444",
};

const btnCreate = {
  backgroundColor: "#1e88e5",
  color: "#fff",
  padding: "8px 14px",
  borderRadius: 6,
  textDecoration: "none",
  fontWeight: 500,
};

const btnEdit = {
  marginRight: "10px",
  background: "#ffc107",
  color: "#000",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  fontSize: "13px",
  cursor: "pointer",
};

const btnDelete = {
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  fontSize: "13px",
  cursor: "pointer",
};
