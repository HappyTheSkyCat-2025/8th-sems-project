import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [countries, setCountries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState({
    id: null,
    country_id: "",
    question: "",
    answer: "",
  });

  // Fetch FAQs + Countries
  useEffect(() => {
    fetchFAQs();
    fetchCountries();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/faqs/");
      // If DRF pagination is enabled
      const faqList = Array.isArray(res.data) ? res.data : res.data.results;
      setFaqs(faqList || []);
    } catch (error) {
      console.error("Failed to load FAQs:", error);
      setFaqs([]);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/countries/");
      const countryList = Array.isArray(res.data) ? res.data : res.data.results;
      setCountries(countryList || []);
    } catch (error) {
      console.error("Failed to load countries:", error);
      setCountries([]);
    }
  };

  const openAddModal = () => {
    setCurrent({ id: null, country_id: "", question: "", answer: "" });
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setCurrent({
      id: faq.id,
      country_id: faq.country?.id || "",
      question: faq.question,
      answer: faq.answer,
    });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (current.id) {
        await axiosInstance.put(`/admin-dashboard/faqs/${current.id}/`, current);
      } else {
        await axiosInstance.post("/admin-dashboard/faqs/", current);
      }
      setModalOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error("Failed to save FAQ:", error.response?.data || error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await axiosInstance.delete(`/admin-dashboard/faqs/${id}/`);
      fetchFAQs();
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  };

  return (
    <div className="faq-container">
      <style>{`
        .faq-container { padding: 20px; }
        .faq-header { display: flex; justify-content: space-between; align-items: center; }
        .add-btn {
          background-color: #2563eb; color: white; border: none; border-radius: 6px;
          padding: 8px 14px; cursor: pointer; font-size: 14px; transition: 0.3s;
        }
        .add-btn:hover { background-color: #1d4ed8; }
        .faq-table {
          width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff;
          border-radius: 8px; overflow: hidden;
        }
        .faq-table th, .faq-table td {
          border: 1px solid #ddd; padding: 10px 12px; text-align: left;
        }
        .faq-table th { background-color: #f1f5f9; font-weight: bold; }
        .details-btn, .delete-btn {
          color: white; border: none; border-radius: 5px; padding: 6px 10px;
          cursor: pointer; transition: 0.3s;
        }
        .details-btn { background-color: #16a34a; margin-right: 6px; }
        .details-btn:hover { background-color: #15803d; }
        .delete-btn { background-color: #dc2626; }
        .delete-btn:hover { background-color: #b91c1c; }
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center; z-index: 999;
        }
        .modal-content {
          background: #fff; padding: 25px; border-radius: 12px; width: 90%; max-width: 420px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2); animation: fadeIn 0.3s ease-in-out;
        }
        .modal-content h3 { text-align: center; margin-bottom: 15px; }
        .form-group { position: relative; margin-top: 18px; }
        .form-group input, .form-group textarea, .form-group select {
          width: 100%; padding: 12px 10px 10px; font-size: 14px; border: 1px solid #ccc;
          border-radius: 6px; outline: none; transition: 0.2s; background: transparent;
        }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
          border-color: #2563eb;
        }
        .form-group label {
          position: absolute; top: 50%; left: 10px; color: #888; transform: translateY(-50%);
          font-size: 14px; pointer-events: none; transition: 0.2s ease all; background: white; padding: 0 4px;
        }
        .form-group input:focus + label,
        .form-group input:not(:placeholder-shown) + label,
        .form-group textarea:focus + label,
        .form-group textarea:not(:placeholder-shown) + label,
        .form-group select:focus + label,
        .form-group select:not([value=""]) + label {
          top: 0; font-size: 12px; color: #2563eb;
        }
        .modal-buttons {
          display: flex; justify-content: space-between; margin-top: 20px;
        }
        .save-btn, .close-btn {
          padding: 8px 16px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;
          transition: 0.3s ease;
        }
        .save-btn { background-color: #16a34a; color: white; }
        .save-btn:hover { background-color: #15803d; }
        .close-btn { background-color: #9ca3af; color: white; }
        .close-btn:hover { background-color: #6b7280; }
        @keyframes fadeIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
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
              <td>{f.country?.name || "—"}</td>
              <td>{f.question}</td>
              <td>{f.answer}</td>
              <td>
                <button className="details-btn" onClick={() => openEditModal(f)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(f.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{current.id ? "Edit FAQ" : "Add FAQ"}</h3>

            <div className="form-group">
              <select
                name="country_id"
                value={current.country_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label>Country</label>
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
