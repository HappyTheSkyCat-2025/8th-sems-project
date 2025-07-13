import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import img2 from "../assets/img2.jpg"; // ✅ Use your custom image

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login button clicked!\n(Frontend only)");
  };

  return (
    <div className="login-full-wrapper">
      <div className="background-angle"></div>

      <div className="login-box">
        {/* Left: Image Side */}
        <div
          className="login-image"
          style={{ backgroundImage: `url(${img2})` }}
        >
          <div className="quote">
            TRAVEL IS THE ONLY THING<br />YOU BUY THAT MAKES YOU RICHER
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="login-form">
          <h2 className="brand-title">TRAVEL BLOGGER</h2>

          <div className="social-icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-google"></i>
            <i className="fab fa-linkedin-in"></i>
          </div>

          <p className="or-text">or use your email account</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Email"
              value={formData.username}
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
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>

            <Link to="/forgot-password" className="forgot-link">
              Forgot Your Password?
            </Link>

            <button type="submit">LOG IN</button>
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
}
