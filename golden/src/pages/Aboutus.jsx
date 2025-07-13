import React from 'react';
import '../styles/AboutUs.css';
import img2 from '../assets/img2.jpg';
import bali from '../assets/bali.jpg';
import image3 from '../assets/img2.jpg';
import image4 from '../assets/bali.jpg';
import image5 from '../assets/img2.jpg';

export default function AboutUs() {
  return (
    <div className="about-container">
      <section className="intro">
        <h1>About Golden Leaf Travels</h1>
        <p>
          Golden Leaf Travels is more than just a travel company – it's a passion project crafted to bring unforgettable travel experiences to every wanderer. 
          From peaceful escapes in nature to thrilling cultural journeys, we design travel that leaves a lasting golden impression.
        </p>
        <img src={img2} alt="Golden Journey" className="about-main-img" />
      </section>

      <section className="our-story">
        <h2>Our Story</h2>
        <p>
          Founded by a group of passionate explorers, Golden Leaf began as a dream to connect people with the beauty of the world. 
          With roots in Nepal, our journeys are deeply personal – we believe every trip should awaken the soul and broaden the heart.
        </p>
        <div className="img-grid">
          <img src={bali} alt="Bali Adventure" />
          <img src={image3} alt="Local Culture" />
        </div>
      </section>

      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          To offer handcrafted travel experiences that are immersive, sustainable, and culturally rich. 
          We aim to empower local communities while giving travelers meaningful and transformative journeys.
        </p>
        <img src={image4} alt="Mission Driven Travel" className="wide-img" />
      </section>

      <section className="vision">
        <h2>Our Vision</h2>
        <p>
          We envision a world where travel is a path to understanding, empathy, and global harmony. 
          Our goal is to lead in responsible tourism while continuously surprising and delighting our travelers.
        </p>
        <img src={image5} alt="Travel Vision" className="wide-img" />
      </section>

      <section className="why-us">
        <h2>Why Travel With Golden Leaf?</h2>
        <ul>
          <li>🌿 Expertly curated travel experiences</li>
          <li>🌍 Authentic local guides and cultural immersion</li>
          <li>✨ Tailored journeys for solo travelers, couples, and families</li>
          <li>💼 Trusted by thousands across the globe</li>
          <li>♻️ Eco-conscious and community-based tourism model</li>
        </ul>
      </section>
    </div>
  );
}
