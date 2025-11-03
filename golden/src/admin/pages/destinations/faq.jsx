import React, { useState } from "react";

const FAQ = () => {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      country: "Nepal",
      question: "What is the best time to visit Nepal?",
      answer:
        "The best time to visit Nepal is during the spring (March–May) and autumn (September–November) seasons.",
    },
    {
      id: 2,
      country: "France",
      question: "Do I need a visa to visit France?",
      answer:
        "Yes, most travelers need a Schengen visa to enter France unless they are from visa-exempt countries.",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    country: "",
    question: "",
    answer: "",
  });

  const openAddModal = () => {
    setCurrent({ id: null, country: "", question: "", answer: "" });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setCurrent(item);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (current.id) {
      setFaqs((prev) => prev.map((f) => (f.id === current.id ? current : f)));
    } else {
      setFaqs((prev) => [...prev, { ...current, id: Date.now() }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="faq-container">
      <style>{`
        .faq-container {
          padding: 20px;
        }

        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .add-btn {
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          cursor: pointer;
          font-size: 14px;
          transition: 0.3s;
        }

        .add-btn:hover {
          background-color: #1d4ed8;
        }

        .faq-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }

        .faq-table th,
        .faq-table td {
          border: 1px solid #ddd;
          padding: 10px 12px;
          text-align: left;
        }

        .faq-table th {
          background-color: #f1f5f9;
          font-weight: bold;
        }

        .details-btn {
          background-color: #16a34a;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 6px 10px;
          cursor: pointer;
          margin-right: 6px;
          transition: 0.3s;
        }

        .details-btn:hover {
          background-color: #15803d;
        }

        .delete-btn {
          background-color: #dc2626;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 6px 10px;
          cursor: pointer;
          transition: 0.3s;
        }

        .delete-btn:hover {
          background-color: #b91c1c;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modal-content {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          width: 90%;
          max-width: 420px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.3s ease-in-out;
        }

        .modal-content h3 {
          text-align: center;
          margin-bottom: 15px;
        }

        .form-group {
          position: relative;
          margin-top: 18px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px 10px 10px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 6px;
          outline: none;
          transition: 0.2s;
          background: transparent;
          resize: none;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
        }

        .form-group label {
          position: absolute;
          top: 50%;
          left: 10px;
          color: #888;
          transform: translateY(-50%);
          font-size: 14px;
          pointer-events: none;
          transition: 0.2s ease all;
          background: white;
          padding: 0 4px;
        }

        .form-group input:focus + label,
        .form-group input:not(:placeholder-shown) + label,
        .form-group textarea:focus + label,
        .form-group textarea:not(:placeholder-shown) + label {
          top: 0;
          font-size: 12px;
          color: #2563eb;
        }

        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .save-btn,
        .close-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s ease;
        }

        .save-btn {
          background-color: #16a34a;
          color: white;
        }

        .save-btn:hover {
          background-color: #15803d;
        }

        .close-btn {
          background-color: #9ca3af;
          color: white;
        }

        .close-btn:hover {
          background-color: #6b7280;
        }

        @keyframes fadeIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className="faq-header">
        <h2>🌍 Country FAQs</h2>
        <button className="add-btn" onClick={openAddModal}>
          + Add FAQ
        </button>
      </div>

      <p>Common travel-related questions categorized by country.</p>

      <table className="faq-table">
        <thead>
          <tr>
            <th>Country</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((f) => (
            <tr key={f.id}>
              <td>{f.country}</td>
              <td>{f.question}</td>
              <td>{f.answer}</td>
              <td>
                <button className="details-btn" onClick={() => openEditModal(f)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(f.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{current.id ? "Edit FAQ" : "Add FAQ"}</h3>

            <div className="form-group">
              <input
                type="text"
                name="country"
                value={current.country}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Country Name</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="question"
                value={current.question}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Question</label>
            </div>

            <div className="form-group">
              <textarea
                name="answer"
                rows="3"
                value={current.answer}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label>Answer</label>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
