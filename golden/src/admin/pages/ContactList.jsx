import React, { useEffect, useState } from "react";
import {
  getMessages,
  deleteMessage,
  getMessage
} from "../api/contactApi";
import "./contact.css";

const ContactList = () => {
  const [messages, setMessages] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchMessages = async (url = null) => {
    try {
      const res = await getMessages(url);
      setMessages(res.data.results);
      setNext(res.data.next);
      setPrevious(res.data.previous);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        console.error("Failed to delete message", err);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Contact Messages</h2>
      <table className="contact-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Received At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.full_name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.subject}</td>
              <td>{m.message}</td>
              <td>{new Date(m.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(m.id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {previous && <button onClick={() => fetchMessages(previous)}>← Previous</button>}
        {next && <button onClick={() => fetchMessages(next)}>Next →</button>}
      </div>
    </div>
  );
};

export default ContactList;
