import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const BookingForm = ({ booking, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    user: "",
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    town: "",
    state: "",
    postcode: "",
    country: "",
    travellers: 1,
    room_option: "",
    add_transfer: false,
    add_nights: 0,
    flight_help: false,
    donation: 0,
    payment_method: "",
    payment_status: "",
    payment_amount: 0,
    transaction_id: "",
    payment_date: "",
    status: "pending",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users for dropdown (you can expand for travel_deals etc similarly)
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("admin-dashboard/users/");
        setUsers(res.data.results || res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (booking) {
      setFormData({
        user: booking.user || "",
        full_name: booking.full_name || "",
        email: booking.email || "",
        phone: booking.phone || "",
        address_line1: booking.address_line1 || "",
        address_line2: booking.address_line2 || "",
        town: booking.town || "",
        state: booking.state || "",
        postcode: booking.postcode || "",
        country: booking.country || "",
        travellers: booking.travellers || 1,
        room_option: booking.room_option || "",
        add_transfer: booking.add_transfer || false,
        add_nights: booking.add_nights || 0,
        flight_help: booking.flight_help || false,
        donation: booking.donation || 0,
        payment_method: booking.payment_method || "",
        payment_status: booking.payment_status || "",
        payment_amount: booking.payment_amount || 0,
        transaction_id: booking.transaction_id || "",
        payment_date: booking.payment_date ? booking.payment_date.slice(0, 10) : "",
        status: booking.status || "pending",
      });
    }
  }, [booking]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{booking ? "Edit Booking" : "Create Booking"}</h3>
        <form onSubmit={handleSubmit}>
          <select name="user" value={formData.user} onChange={handleChange} required>
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
            ))}
          </select>

          <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />

          <input name="address_line1" value={formData.address_line1} onChange={handleChange} placeholder="Address Line 1" />
          <input name="address_line2" value={formData.address_line2} onChange={handleChange} placeholder="Address Line 2" />
          <input name="town" value={formData.town} onChange={handleChange} placeholder="Town" />
          <input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
          <input name="postcode" value={formData.postcode} onChange={handleChange} placeholder="Postcode" />
          <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />

          <input name="travellers" type="number" min={1} value={formData.travellers} onChange={handleChange} placeholder="Travellers" />

          <input name="room_option" value={formData.room_option} onChange={handleChange} placeholder="Room Option" />

          <label>
            <input type="checkbox" name="add_transfer" checked={formData.add_transfer} onChange={handleChange} />
            Add Transfer
          </label>

          <input name="add_nights" type="number" min={0} value={formData.add_nights} onChange={handleChange} placeholder="Additional Nights" />

          <label>
            <input type="checkbox" name="flight_help" checked={formData.flight_help} onChange={handleChange} />
            Flight Help
          </label>

          <input name="donation" type="number" min={0} step="0.01" value={formData.donation} onChange={handleChange} placeholder="Donation" />

          <input name="payment_method" value={formData.payment_method} onChange={handleChange} placeholder="Payment Method" />
          <input name="payment_status" value={formData.payment_status} onChange={handleChange} placeholder="Payment Status" />
          <input name="payment_amount" type="number" min={0} step="0.01" value={formData.payment_amount} onChange={handleChange} placeholder="Payment Amount" />
          <input name="transaction_id" value={formData.transaction_id} onChange={handleChange} placeholder="Transaction ID" />
          <input name="payment_date" type="date" value={formData.payment_date} onChange={handleChange} placeholder="Payment Date" />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="canceled">Canceled</option>
          </select>

          <button type="submit">{booking ? "Update" : "Create"}</button>
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
