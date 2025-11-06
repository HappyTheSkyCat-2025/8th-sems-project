import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./payment.css";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(null);

  // Fetch bookings/payments
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axiosInstance.get("/admin-dashboard/bookings/");
      // Map backend fields to match your table display
      const data = (Array.isArray(res.data) ? res.data : res.data.results || []).map(
        (b) => ({
          id: b.id,
          name: b.full_name || `${b.user?.first_name} ${b.user?.last_name}` || "—",
          status: b.payment_status || "Pending",
          method: b.payment_method || "N/A",
          transactionId: b.transaction_id || "—",
          date: b.payment_date || b.created_at?.split("T")[0] || "—",
        })
      );
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      setPayments([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await axiosInstance.delete(`/admin-dashboard/bookings/${id}/`);
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  const handleDetails = (payment) => setSelected(payment);
  const closeModal = () => setSelected(null);

  return (
    <div className="user-container">
      <h2 className="page-title">💳 Payments</h2>
      <p className="page-desc">Manage and review all transactions.</p>

      <div className="table-responsive">
        <table className="table align-middle custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(payments) && payments.length ? (
              payments.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.status === "Completed"
                          ? "status-completed"
                          : "status-pending"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.method}</td>
                  <td>{item.transactionId}</td>
                  <td>{item.date}</td>
                  <td>
                    <button
                      className="btn-action btn-details me-2"
                      onClick={() => handleDetails(item)}
                    >
                      Details
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>Payment Details</h4>
            <hr />
            <p><strong>Name:</strong> {selected.name}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge ${
                  selected.status === "Completed"
                    ? "status-completed"
                    : "status-pending"
                }`}
              >
                {selected.status}
              </span>
            </p>
            <p><strong>Method:</strong> {selected.method}</p>
            <p><strong>Transaction ID:</strong> {selected.transactionId}</p>
            <p><strong>Date:</strong> {selected.date}</p>
            <button className="btn-action btn-details mt-2" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
