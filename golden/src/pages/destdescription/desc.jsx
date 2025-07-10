import React from "react";
import {
  FaUserFriends,
  FaMapSigns,
  FaGlobe,
  FaUsers,
  FaLanguage,
  FaStar,
  FaFileDownload,
  FaPhoneAlt,
} from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import img2 from "../../assets/img2.jpg";
import bali from "../../assets/bali.jpg";
import "../../pagescss/desc.css";

export default function Desc() {
  return (
    <section className="trip-section">
      <div className="trip-header">
        <h1>place</h1>
        <p>
          <strong>15 days</strong> · <FaStar className="star" /> 5.0{" "}
          <span className="review-count">455 reviews</span> · From Hanoi to Ho
          Chi Minh City
        </p>
      </div>

      {/* Wrap gallery and booking box side by side */}
      <div className="trip-content">
        {/* Left side - Gallery */}
        <div className="trip-gallery">
          <div className="top-gallery">
            <img src={img2} alt="culture" />
            <img src={bali} alt="temple" />
          </div>

          <div className="bottom-imgs">
            <img src={bali} alt="Rice fields" />
            <img src={img2} alt="Market scene" />
            <div className="testimonial">
              <p>
                She was articulate about every detail of the trip from providing
                information to her consistent, wonderful personality and kindness!
              </p>
              <div className="testimonial-footer">
                <span>Amanda · Travelled in December</span>
                <span>
                  <FaStar className="star" /> 5.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Booking & Plan */}
        <div className="trip-info-box">
          <h3>
            From <strong>EUR £4562</strong>
          </h3>

          <button className="wishlist-btn">
            Add to my wishlist <CiHeart />
          </button>
          <button className="book-btn">View Dates And Book</button>

          <div className="trip-actions">
            <p className="plan-title">Plan your adventure:</p>
            <a href="#" className="download">
              <FaFileDownload /> Download PDF Brochure
            </a>
            <a href="#" className="contact">
              <FaPhoneAlt /> Contact Operator
            </a>
          </div>
        </div>
      </div>

      {/* Bottom icons grid */}
      <div className="trip-icons">
        <div>
          <FaUserFriends /> Platinum Operator: Hoi An Express
        </div>
        <div>
          <FaUsers /> Group Tour: Join a group and forge lifelong friendships
        </div>
        <div>
          <FaLanguage /> Guided in English
        </div>
        <div>
          <FaMapSigns /> Age range 1 to 99
        </div>
        <div>
          <FaGlobe /> In-depth Cultural: Immerse yourself in rich history and
          local traditions
        </div>
        <div>
          <FaMapSigns /> Partially Guided: Independent travel with selected
          excursions
        </div>
        <div>
          <FaUsers /> Group Size 2 - 15
        </div>
      </div>
    </section>
  );
}
