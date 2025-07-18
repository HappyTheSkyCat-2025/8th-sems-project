// src/Components/Auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
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
      // 1. Email/password login
      const response = await axiosInstance.post("/token/", formData);
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      axiosInstance.defaults.headers.Authorization = `Bearer ${access}`;

      // 2. Fetch profile
      const profileResponse = await axiosInstance.get("/accounts/profile/");

      // 3. Redirect
      if (profileResponse.data.is_superuser) {
        toast.success("Welcome Admin! Redirecting...");
        navigate("/admin");
      } else {
        toast.success("Login successful! Redirecting...");
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "Invalid credentials or server error.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post("/accounts/google-login/", {
        token: credentialResponse.credential,
      });
      const { access, refresh } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      axiosInstance.defaults.headers.Authorization = `Bearer ${access}`;

      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="login-full-wrapper">
      <div className="background-angle"></div>

      <div className="login-box">
        {/* Left: Background image */}
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
                />
              </span>
            </div>

            <Link to="/forgot-password" className="forgot-link">
              Forgot Your Password?
            </Link>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "LOG IN"}
            </button>
          </form>

          {/* Google Sign‑In */}
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign‑in failed")}
            />
          </div>

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
