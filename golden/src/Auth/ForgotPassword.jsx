// src/Components/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/forgetpassword.css';
import backgroundImage from '../assets/forgot-bg.webp'; 

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/password-reset/request/', {
        email,
      });
      toast.success(response.data.message || 'OTP sent to your email!');
      localStorage.setItem('reset_email', email);
      setTimeout(() => navigate('/reset-password'), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive an OTP for password reset.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="back-login">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ForgotPassword;
