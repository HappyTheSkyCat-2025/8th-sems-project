// src/Components/Auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/accounts/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      });

      localStorage.setItem("registered_email", formData.email);
      toast.success("Registration successful! Please check your email for OTP.");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/verify-otp"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data) {
        const msgs = Object.values(error.response.data).flat().join(" ");
        toast.error(`Registration failed: ${msgs}`);
      } else {
        toast.error("An error occurred during registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/accounts/google-login/", {
        token: credentialResponse.credential,
      });
      const { access, refresh } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      axiosInstance.defaults.headers.Authorization = `Bearer ${access}`;

      toast.success("Signed up with Google!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create your account</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="form-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
              className="form-control"
              required
            />
            <label htmlFor="username">Username</label>
          </div>

          {/* Email */}
          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className="form-control"
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          {/* Password */}
          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="form-control"
              required
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              className="form-control"
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <button
              type="button"
              className="toggle-eye"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <hr />

        {/* Google Sign‑Up */}
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google signup failed")}
          />
        </div>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
