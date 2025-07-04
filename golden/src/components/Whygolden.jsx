import React from "react";
import "../styles/Whygolden.css";
import img2 from "../assets/img2.jpg";

import { GoPeople } from "react-icons/go";
import { CiMap, CiStar } from "react-icons/ci";
import { LuLeaf } from "react-icons/lu";

export default function WhyGolden() {
  return (
    <section className="why-golden-section">
      <h2 className="why-golden-title">Why Choose Golden Travels?</h2>

      <div className="why-golden-container">
        <div className="text-wrapper">
          <p className="why-golden-description">
            At Golden Travels, we provide exclusive journeys with personalized
            experiences, unmatched hospitality, and unforgettable memories.
            Our expert guides and custom itineraries ensure you explore the
            world in comfort and style.
          </p>
          <button className="read-more-btn">Read more about our story</button>
        </div>

        <div className="image-wrapper">
          <img src={img2} alt="Why Golden Travels" />
        </div>
      </div>

      <div className="info-boxes">
        <div className="info-box">
          <GoPeople className="info-icon" />
          <h3 className="info-title">Small Group Travel</h3>
          <p className="info-description">
            Travel in intimate groups to enjoy personalized experiences.  
            Build lasting memories with like-minded travelers.
          </p>
        </div>

        <div className="info-box">
          <CiMap className="info-icon" />
          <h3 className="info-title">Expert Local Guides</h3>
          <p className="info-description">
            Discover hidden gems with knowledgeable guides.  
            Experience authentic culture and stories firsthand.
          </p>
        </div>

        <div className="info-box">
          <CiStar className="info-icon" />
          <h3 className="info-title">Unique Experience</h3>
          <p className="info-description">
            Explore tailor-made itineraries crafted just for you.  
            Enjoy unforgettable adventures off the beaten path.
          </p>
        </div>

        <div className="info-box">
          <LuLeaf className="info-icon" />
          <h3 className="info-title">Sustainable Tourism</h3>
          <p className="info-description">
            Travel responsibly with eco-friendly practices.  
            Support local communities and preserve nature.
          </p>
        </div>
      </div>
    </section>
  );
}
