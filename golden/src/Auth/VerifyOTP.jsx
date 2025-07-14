import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: localStorage.getItem("registered_email") || "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.otp) {
      toast.error("Please enter both email and OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Email verified successfully!");
        localStorage.removeItem("registered_email");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.error || "Invalid OTP or email");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f7fa",
          padding: "1rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: "2.5rem 3rem",
            borderRadius: "1rem",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
          noValidate
        >
          <h2 style={{ marginBottom: "1.5rem", color: "#2c3e50", fontWeight: "700", textAlign: "center" }}>
            Verify Your Email
          </h2>

          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#34495e" }}
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your registered email"
            required
            disabled={!!formData.email}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.6rem",
              border: "1.5px solid #ced4da",
              marginBottom: "1.5rem",
              fontSize: "1rem",
              transition: "border-color 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
          />

          <label
            htmlFor="otp"
            style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#34495e" }}
          >
            OTP Code
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            required
            pattern="\d{6}"
            title="Please enter exactly 6 digits"
            autoComplete="one-time-code"
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.6rem",
              border: "1.5px solid #ced4da",
              marginBottom: "2rem",
              fontSize: "1rem",
              transition: "border-color 0.3s ease",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem",
              backgroundColor: "#007bff",
              color: "#fff",
              fontWeight: "700",
              fontSize: "1.1rem",
              borderRadius: "0.8rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(0, 123, 255, 0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.6rem",
              transition: "background-color 0.25s ease",
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#007bff")}
            aria-live="polite"
          >
            {loading && (
              <svg
                style={{ width: "20px", height: "20px", animation: "spin 1s linear infinite" }}
                viewBox="0 0 50 50"
                aria-hidden="true"
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray="90,150"
                />
              </svg>
            )}
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </form>
      </div>
    </>
  );
};

export default VerifyOTP;
