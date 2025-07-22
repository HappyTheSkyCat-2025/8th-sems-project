import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  FaUser, FaEnvelope, FaPhone, FaGlobeAsia, FaStar, FaEye, FaEyeSlash,
} from "react-icons/fa";
import { MdPhotoCamera } from "react-icons/md"; // Updated Icon
import "../styles/profile.css";
import bali from "../assets/bali.jpg";

// Tab Components
import MyBookings from "../Auth/booking";
import Reminders from "../Auth/remainder";
import FavouritePackages from "../Auth/fav";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [passwordVisibility, setPasswordVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/accounts/profile/");
        setProfile(res.data);
        setEditData(res.data);
      } catch (err) {
        setError("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);
      try {
        const res = await axiosInstance.put("/accounts/profile/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setProfile(res.data);
        setEditData(res.data);
        setNewImage(URL.createObjectURL(file));
      } catch (err) {
        alert("Image upload failed.");
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put("/accounts/profile/", {
        username: editData.username,
        email: editData.email,
        phone: editData.phone,
        nationality: editData.nationality,
      });
      setProfile(res.data);
      setShowModal(false);
    } catch (err) {
      alert("Failed to save profile.");
    }
  };

  if (loading) return <p className="profile-loading">Loading profile...</p>;
  if (error) return <p className="profile-error">{error}</p>;

  return (
    <>
      <div className="profile-card">
        <div className="profile-left">
          <div className="profile-img-wrapper">
            <img
              src={newImage || profile.profile_image || bali}
              alt="Profile"
              className="profile-avatar"
            />
          </div>
          <button className="edit-button" onClick={handleEditClick}>
            <FaStar className="edit-icon" /> Edit Profile
          </button>
        </div>

        <div className="profile-right">
          <div className="profile-field">
            <FaUser className="profile-icon" />
            <input type="text" value={profile.username} readOnly />
          </div>
          <div className="profile-field">
            <FaEnvelope className="profile-icon" />
            <input type="email" value={profile.email} readOnly />
          </div>
          <div className="profile-field">
            <FaPhone className="profile-icon" />
            <input type="text" value={profile.phone || "Not provided"} readOnly />
          </div>
          <div className="profile-field">
            <FaGlobeAsia className="profile-icon" />
            <input type="text" value={profile.nationality || "Not specified"} readOnly />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <div
          className={`tab-item ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings
        </div>
        <div
          className={`tab-item ${activeTab === "reminders" ? "active" : ""}`}
          onClick={() => setActiveTab("reminders")}
        >
          Reminders & Upcoming
        </div>
        <div
          className={`tab-item ${activeTab === "favourites" ? "active" : ""}`}
          onClick={() => setActiveTab("favourites")}
        >
          Favourite Packages
        </div>
      </div>
      <div className="tab-content">
        {activeTab === "bookings" && <MyBookings />}
        {activeTab === "reminders" && <Reminders />}
        {activeTab === "favourites" && <FavouritePackages />}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* Image Upload (Only here) */}
            <div className="modal-img-wrapper">
              <img
                src={newImage || profile.profile_image || bali}
                alt="Profile"
                className="modal-avatar"
              />
              <label htmlFor="upload-modal-photo" className="camera-icon-modal">
                <MdPhotoCamera />
              </label>
              <input
                type="file"
                id="upload-modal-photo"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </div>

            <div className="modal-body">
              <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleInputChange}
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={editData.phone || ""}
                onChange={handleInputChange}
                placeholder="Phone"
              />

              <div className="password-field">
                <input
                  type={passwordVisibility.old ? "text" : "password"}
                  placeholder="Old Password"
                />
                <span onClick={() => togglePasswordVisibility("old")}>
                  {passwordVisibility.old ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <div className="password-field">
                <input
                  type={passwordVisibility.new ? "text" : "password"}
                  placeholder="New Password"
                />
                <span onClick={() => togglePasswordVisibility("new")}>
                  {passwordVisibility.new ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <div className="password-field">
                <input
                  type={passwordVisibility.confirm ? "text" : "password"}
                  placeholder="Confirm New Password"
                />
                <span onClick={() => togglePasswordVisibility("confirm")}>
                  {passwordVisibility.confirm ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleSave} className="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
