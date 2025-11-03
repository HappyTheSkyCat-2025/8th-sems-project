import React, { useState } from "react";
import "./payment.css";

const Payment = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      name: "Dipesh Thapa",
      status: "Completed",
      method: "Credit Card",
      transactionId: "TXN123456",
      date: "2025-11-02",
    },
    {
      id: 2,
      name: "Sita Gurung",
      status: "Pending",
      method: "PayPal",
      transactionId: "TXN987654",
      date: "2025-11-01",
    },
  ]);

  const [selected, setSelected] = useState(null);

  const handleDelete = (id) => setPayments(payments.filter((p) => p.id !== id));
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
            {payments.map((item) => (
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h4>Payment Details</h4>
            <hr />
            <p>
              <strong>Name:</strong> {selected.name}
            </p>
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
            <p>
              <strong>Method:</strong> {selected.method}
            </p>
            <p>
              <strong>Transaction ID:</strong> {selected.transactionId}
            </p>
            <p>
              <strong>Date:</strong> {selected.date}
            </p>
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
