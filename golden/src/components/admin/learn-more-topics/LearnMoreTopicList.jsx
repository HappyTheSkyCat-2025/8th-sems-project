import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function LearnMoreTopicList() {
  const { country_slug } = useParams();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    axios
      .get(`/api/destinations/countries/${country_slug}/learn-more-topics/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTopics(res.data.results || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load topics:", err);
        setLoading(false);
      });
  }, [country_slug]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;

    const token = localStorage.getItem("access_token");
    axios
      .delete(`/api/destinations/countries/${country_slug}/learn-more-topics/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setTopics((prev) => prev.filter((t) => t.id !== id)))
      .catch((err) => alert("Failed to delete: " + err.message));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontWeight: 600 }}>📚 Learn More Topics for "{country_slug}"</h2>
        <Link to="create" style={btnCreate}>
          + New Topic
        </Link>
      </div>

      {topics.length === 0 ? (
        <p style={{ color: "#777" }}>No topics found.</p>
      ) : (
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Order</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic) => (
              <tr key={topic.id} style={trStyle}>
                <td style={tdStyle}>{topic.title}</td>
                <td style={tdStyle}>{topic.description}</td>
                <td style={tdStyle}>{topic.order}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <button onClick={() => navigate(`${topic.id}/edit`)} style={btnEdit}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(topic.id)} style={btnDelete}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 10,
  overflow: "hidden",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
};

const theadStyle = { background: "#f7f7f7" };
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

const trStyle = { borderBottom: "1px solid #eee" };

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
