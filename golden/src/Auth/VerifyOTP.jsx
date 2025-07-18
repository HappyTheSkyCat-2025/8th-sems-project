import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import otpImage from "../assets/otp.png";
import "../styles/otp1.css";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("reset_email");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return toast.error("Please enter a valid 6-digit code.");
    }

    setLoading(true);
    try {
      await axiosInstance.post("/accounts/password-reset/verify/", {
        email,
        otp: otpCode,
      });

      toast.success("OTP verified! Proceed to reset password.");
      navigate("/reset-password");
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post("/accounts/password-reset/request/", { email });
      toast.success("New OTP sent to your email.");
    } catch {
      toast.error("Failed to resend OTP. Try again later.");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-wrapper">
        <div className="otp-image">
          <img src={otpImage} alt="OTP Visual" />
        </div>

        <div className="otp-form-card">
          <h2>Reset Password</h2>

          <div className="otp-steps">
            <div className="otp-step done">
              <div className="circle">1</div>
              <span>Email</span>
            </div>
            <div className="otp-line highlight" />
            <div className="otp-step active">
              <div className="circle">2</div>
              <span>Verify</span>
            </div>
            <div className="otp-line" />
            <div className="otp-step">
              <div className="circle">3</div>
              <span>Reset</span>
            </div>
          </div>

          <p className="otp-desc">
            We’ve sent a 6-digit verification code to <b>{email}</b>
          </p>

          <form onSubmit={handleSubmit} className="otp-input-form">
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                />
              ))}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          <div className="otp-resend">
            Didn’t receive a code?
            <span onClick={handleResend}> Resend</span>
          </div>

          <div className="otp-bottom">
            Remember your password? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
