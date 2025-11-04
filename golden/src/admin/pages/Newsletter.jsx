import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "admin-dashboard/newsletters/";

  // Fetch all subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_URL);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setSubscribers(data);
      } catch (err) {
        console.error("Error fetching subscribers:", err);
        setError("Failed to load subscribers. Check if you're logged in as admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  // Delete a subscriber
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await axiosInstance.delete(`${API_URL}${id}/`);
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error("Error deleting subscriber:", err);
        alert("Failed to delete subscriber.");
      }
    }
  };

  if (loading) return <p>Loading subscribers...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="newsletter-container">
      <h2>Newsletter Subscribers</h2>

      <div className="table-wrapper">
        <table className="newsletter-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length > 0 ? (
              subscribers.map((sub) => {
                const created = new Date(sub.created_at);
                const date = created.toLocaleDateString();
                const time = created.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={sub.id}>
                    <td data-label="Email">{sub.email}</td>
                    <td data-label="Date">
                      {new Date(sub.subscribed_at).toLocaleDateString() || "-"}
                    </td>
                    <td data-label="Time">
                      {new Date(sub.subscribed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "-"}
                    </td>
                    <td data-label="Actions">
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(sub.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No subscribers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .newsletter-container {
          padding: 30px;
          font-family: Arial, sans-serif;
          background: #f0f2f5;
          min-height: 100vh;
        }
        .newsletter-container h2 {
          margin-bottom: 20px;
          color: #333;
          font-size: 26px;
        }
        .table-wrapper {
          overflow-x: auto;
        }
        .newsletter-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
        }
        .newsletter-table th, .newsletter-table td {
          padding: 12px 16px;
          border: 1px solid #ddd;
          text-align: left;
        }
        .newsletter-table th {
          font-weight: 600;
          background: #f5f5f5;
        }
        .delete-btn {
          padding: 6px 12px;
          background-color: #ff4d4f;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.2s;
        }
        .delete-btn:hover {
          background-color: #c81e1e;
        }

        @media (max-width: 768px) {
          .newsletter-table thead {
            display: none;
          }
          .newsletter-table, .newsletter-table tbody, .newsletter-table tr, .newsletter-table td {
            display: block;
            width: 100%;
          }
          .newsletter-table tr {
            margin-bottom: 15px;
            background: #fff;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .newsletter-table td {
            text-align: left;
            padding-left: 0;
            position: relative;
            padding-top: 8px;
            padding-bottom: 8px;
          }
          .newsletter-table td::before {
            content: attr(data-label);
            font-weight: 600;
            display: block;
            margin-bottom: 5px;
            color: #555;
          }
          .delete-btn {
            width: 100%;
            text-align: center;
            margin-top: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Newsletter;
