import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import "../styles/footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email.");
      return;
    }
    setMessage("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Golden Travels</h2>
          <p>Discover your next adventure with us.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="#trips">Trips</a>
            </li>
            <li>
              <a href="#journey">Journey</a>
            </li>
            <li>
              <a href="#journal">Travel Journal</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: info@goldentravels.com</p>
          <p>Phone: +977 123 4567</p>
          <p>Address: Kathmandu, Nepal</p>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <h4>Subscribe to our newsletter</h4>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
            {message && <p className="subscription-message">{message}</p>}
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Golden Travels. All rights reserved.</p>
      </div>
    </footer>
  );
}
