import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import "../styles/write.css";

const FaqDropdown = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <div className="faq-title" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <RiArrowDropDownLine
          className={`dropdown-icon ${open ? "rotated" : ""}`}
          size={24}
        />
      </div>
      {open && <div className="faq-content">{children}</div>}
    </div>
  );
};

export default function BecomeContributor() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description.length < 300) {
      alert("Description must be at least 300 characters.");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("email", email);
    formData.append("country", country);
    formData.append("cities", cities);
    formData.append("description", description);
    images.forEach((img) => formData.append("images", img));

    // 👇 Replace this with your API call
    console.log("Form Submitted", {
      firstName,
      email,
      country,
      cities,
      description,
      images,
    });

    alert("Form submitted successfully!");
  };

  return (
    <div className="contributor-container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> <span className="arrow">›</span>
        <span>Become a Contributor</span>
      </nav>

      <div className="contributor-content">
        <h1>Become a Contributor</h1>
        <p className="intro">
          So, you want to write for The Good Times? Great!
        </p>
        <p className="short-desc">
          We’re always eager to hear from travellers who are interested in
          sharing their travel tales and passion for the good life. We regularly
          work with journalists, freelance writers and Intrepid travellers to
          capture the joy of travel and how it shapes us and our world.
        </p>

        <FaqDropdown title="📌 Rules & What You Can Post">
          <ul>
            <li>✅ Original travel experiences, tips, reflections</li>
            <li>✅ Stories from Intrepid tours or personal journeys</li>
            <li>❌ No plagiarized content or promotional material</li>
            <li>✅ Photos must be owned by you or credited properly</li>
          </ul>
        </FaqDropdown>

        <FaqDropdown title="🧭 What we’re looking for">
          <ul>
            <li>
              <strong>Good Stories</strong> – Unique experiences & travel
              narratives
            </li>
            <li>
              <strong>Good Trips</strong> – Adventures, challenges, and
              highlights
            </li>
            <li>
              <strong>Good Life</strong> – Food, culture, people, personal
              growth
            </li>
            <li>
              <strong>Good Ideas</strong> – Travel tips, reflections, insights
            </li>
          </ul>
        </FaqDropdown>

        <form className="contributor-form" onSubmit={handleSubmit}>
          <label>
            First Name<span className="required">*</span>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>

          <label>
            Email<span className="required">*</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Country Visited<span className="required">*</span>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>

          <label>
            Cities Name<span className="required">*</span>
            <input
              type="text"
              required
              value={cities}
              onChange={(e) => setCities(e.target.value)}
            />
          </label>

          <label>
            Description (Min. 300 characters)
            <span className="required">*</span>
            <textarea
              required
              minLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label>
            Upload Images (multiple allowed)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                setImages(Array.from(e.target.files))
              }
            />
          </label>

          {images.length > 0 && (
            <div className="image-preview">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${idx}`}
                  className="preview-img"
                />
              ))}
            </div>
          )}

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
