import React, { useState } from "react";
import { Trash2, X, MessageCircle } from "lucide-react";
import "./contact.css";

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="bc-modal-overlay">
      <div className="bc-modal-content">
        <div className="bc-modal-header">
          <h3>Confirm Deletion</h3>
          <button className="bc-close-btn" onClick={onCancel}><X size={20} /></button>
        </div>
        <p>{message}</p>
        <div className="bc-modal-actions">
          <button className="bc-btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="bc-btn-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const BetterContactList = () => {
  const [messages, setMessages] = useState([
    { id: 1, full_name: "John Doe", email: "john@example.com", phone: "1234567890", subject: "Inquiry", message: "Hello, I have a question about booking procedures for international flights." },
    { id: 2, full_name: "Jane Smith", email: "jane@example.com", phone: "9876543210", subject: "Support", message: "Need immediate help with my booking ID #TRV901 as the dates seem incorrect." },
    { id: 3, full_name: "Alice Brown", email: "alice@example.com", phone: "5551234567", subject: "Feedback", message: "Great website design! Very easy to navigate and find the travel deals." },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setMessageToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setMessages(messages.filter((m) => m.id !== messageToDelete));
    setIsModalOpen(false);
    setMessageToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setMessageToDelete(null);
  };

  return (
    <div className="bc-container">
      <header className="bc-header">
        <h1><MessageCircle size={28} /> Contact Messages</h1>
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
            {messages.map((m) => (
              <tr key={m.id}>
                <td data-label="Name">{m.full_name}</td>
                <td data-label="Email">{m.email}</td>
                <td data-label="Phone">{m.phone}</td>
                <td data-label="Subject">{m.subject}</td>
                <td data-label="Message">{m.message}</td>
                <td data-label="Actions">
                  <button className="bc-delete-btn" onClick={() => handleDeleteClick(m.id)}>
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
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
