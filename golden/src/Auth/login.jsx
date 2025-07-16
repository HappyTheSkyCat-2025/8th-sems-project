// src/Components/Auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import "../styles/login.css";
import loginBg from "../assets/login.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Login and get tokens
      const response = await axiosInstance.post("/token/", formData);

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // 2. Fetch user profile with access token
      const profileResponse = await axiosInstance.get("/accounts/profile/");

      // 3. Redirect based on superuser status
      if (profileResponse.data.is_superuser) {
        toast.success("Welcome Admin! Redirecting...");
        setTimeout(() => navigate("/admin"), 1500);
      } else {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      // handle error message from backend or fallback
      const errorMsg =
        error.response?.data?.detail || "Invalid credentials or server error.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-full-wrapper">
      <div className="background-angle"></div>

      <div className="login-box">
        {/* Left: Background image with quote */}
        <div
          className="login-image"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="quote">
            DISCOVER THE WORLD <br /> WITH GOLDEN LEAF TRAVELS
          </div>
        </div>

        {/* Right: Login form */}
        <div className="login-form">
          <h2 className="brand-title">GOLDEN LEAF TRAVELS</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fas ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </span>
            </div>

            <Link to="/forgot-password" className="forgot-link">
              Forgot Your Password?
            </Link>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>

          <div className="register-text">
            Don’t have an account?{" "}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
