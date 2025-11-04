import React, { useState, useEffect } from "react";
import { Trash2, X, MessageCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import "./contact.css";

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="bc-modal-overlay">
      <div className="bc-modal-content">
        <div className="bc-modal-header">
          <h3>Confirm Deletion</h3>
          <button className="bc-close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        <p>{message}</p>
        <div className="bc-modal-actions">
          <button className="bc-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="bc-btn-confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const BetterContactList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const CONTACT_API = "admin-dashboard/contact-messages/";

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(CONTACT_API);
        const data = res.data.results || res.data; // handle pagination or non-paginated
        setMessages(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load messages. Are you an admin?");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Delete
  const handleDeleteClick = (id) => {
    setMessageToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`${CONTACT_API}${messageToDelete}/`);
      setMessages(messages.filter((m) => m.id !== messageToDelete));
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    } finally {
      setIsModalOpen(false);
      setMessageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setMessageToDelete(null);
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="bc-container">
      <header className="bc-header">
        <h1>
          <MessageCircle size={28} /> Contact Messages
        </h1>
        <p>View and manage messages sent by users efficiently.</p>
      </header>

      <div className="bc-table-wrapper">
        <table className="bc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((m) => (
                <tr key={m.id}>
                  <td data-label="Name">{m.full_name}</td>
                  <td data-label="Email">{m.email}</td>
                  <td data-label="Phone">{m.phone}</td>
                  <td data-label="Subject">{m.subject}</td>
                  <td data-label="Message">{m.message}</td>
                  <td data-label="Actions">
                    <button
                      className="bc-delete-btn"
                      onClick={() => handleDeleteClick(m.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}
                >
                  🎉 No messages found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this message permanently?"
      />
    </div>
  );
};

export default BetterContactList;
