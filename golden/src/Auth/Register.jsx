import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/register.css";
import registerImg from "../assets/register.png";

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
  const [agreeTerms, setAgreeTerms] = useState(false);

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

    if (!agreeTerms) {
      toast.error("You must agree to the terms first.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/accounts/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
      });

      localStorage.setItem("registered_email", formData.email);
      toast.success("Registration successful! Check your email for OTP.");
      setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/verify-otp"), 2000);
    } catch (error) {
      const msgs = error.response?.data
        ? Object.values(error.response.data).flat().join(" ")
        : "An error occurred during registration.";
      toast.error(`Registration failed: ${msgs}`);
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
    } catch {
      toast.error("Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-image">
          <img src={registerImg} alt="Register Visual" />
        </div>

        <div className="register-form">
          <h2>Golden Leaf Travels</h2>
          <p className="sub-text">Join us today</p>

          <div className="google-signup">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google signup failed")}
            />
          </div>

          <div className="or-separator">or</div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group">
              <FaUser className="input-icon-fullname" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder=" "
                required
                className="fullname-input"
              />
              <label className="label-fullname">Full Name</label>
            </div>

            {/* Email */}
            <div className="form-group">
              <FaEnvelope className="input-icon-standard" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
                className="form-input"
              />
              <label className="label-standard">Email Address</label>
            </div>

            {/* Password */}
            <div className="form-group">
              <FaLock className="input-icon-standard" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
                className="form-input"
              />
              <label className="label-standard">Password</label>
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <FaLock className="input-icon-standard" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                required
                className="form-input"
              />
              <label className="label-standard">Confirm Password</label>
              <button
                type="button"
                className="toggle-eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Terms Checkbox */}
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
            >
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                style={{ marginRight: "10px" }}
              />
              <label htmlFor="terms" style={{ fontSize: "0.9rem", color: "#555" }}>
                I agree to the{" "}
                <a
                  href="#"
                  style={{ color: "var(--primary-dark)", textDecoration: "none" }}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  style={{ color: "var(--primary-dark)", textDecoration: "none" }}
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading || !agreeTerms}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
