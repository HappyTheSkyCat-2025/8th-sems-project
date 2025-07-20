import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import beach from "../assets/confirm.png"; // Use your beach image path
import "../styles/rest.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password reset successful!");
  };

  return (
    <div className="resetpass-wrapper">
      <div className="resetpass-container">
        <div className="resetpass-left">
          <img src={beach} alt="beach" className="resetpass-img" />
        </div>
        <div className="resetpass-right">
          <div className="resetpass-card">
            <div className="resetpass-top">
              <ArrowLeft className="resetpass-back" onClick={() => navigate("/verify-otp")} />
              <h2>Reset Password</h2>
            </div>

            <div className="resetpass-steps">
              <div className="resetpass-step done">1</div>
              <div className="resetpass-line done"></div>
              <div className="resetpass-step done">2</div>
              <div className="resetpass-line done"></div>
              <div className="resetpass-step done">3</div>
            </div>

            <div className="resetpass-labels">
              <span>Email</span>
              <span>Verify</span>
              <span>Reset</span>
            </div>

            <p className="resetpass-instruction">Create a new password for your account.</p>

            <div className="resetpass-inputgroup">
              <label>New Password</label>
              <div className="resetpass-inputbox">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {showPassword ? (
                  <Eye onClick={() => setShowPassword(false)} />
                ) : (
                  <EyeOff  onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>

            <div className="resetpass-inputgroup">
              <label>Confirm New Password</label>
              <div className="resetpass-inputbox">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {showConfirm ? (
                  <Eye onClick={() => setShowConfirm(false)} />
                ) : (
                  <EyeOff onClick={() => setShowConfirm(true)} />
                )}
              </div>
            </div>

            <button className="resetpass-btn" onClick={handleReset}>
              Reset Password
            </button>

            <p className="resetpass-signin">
              Remember your password?{" "}
              <span onClick={() => navigate("/login")}>Sign in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
