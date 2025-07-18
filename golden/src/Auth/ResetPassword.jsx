import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Prefer state over localStorage
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("reset_email");

    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      toast.error("Email not found. Please restart the reset process.");
      navigate("/forgot-password");
    }
  }, [location.state, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!email) {
      toast.error("No email found. Please restart the password reset process.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/accounts/password-reset/confirm/", {
        email,
        new_password: formData.newPassword,
      });

      toast.success(response.data.message || "Password reset successful!");
      localStorage.removeItem("reset_email");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const data = error.response?.data;
      const errorMessage =
        data && typeof data === "object"
          ? Object.values(data).flat().join(" ")
          : "Failed to reset password.";
      toast.error(errorMessage || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <h2
          style={{
            marginBottom: "1.5rem",
            color: "#2c3e50",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Reset Password
        </h2>

        <label
          htmlFor="newPassword"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#34495e",
          }}
        >
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.6rem",
            border: "1.5px solid #ced4da",
            marginBottom: "1.5rem",
            fontSize: "1rem",
            outline: "none",
          }}
        />

        <label
          htmlFor="confirmPassword"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#34495e",
          }}
        >
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm new password"
          required
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.6rem",
            border: "1.5px solid #ced4da",
            marginBottom: "2rem",
            fontSize: "1rem",
            outline: "none",
          }}
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
          onMouseEnter={(e) =>
            !loading && (e.target.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            !loading && (e.target.style.backgroundColor = "#007bff")
          }
          aria-live="polite"
        >
          {loading && (
            <svg
              style={{
                width: "20px",
                height: "20px",
                animation: "spin 1s linear infinite",
              }}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
