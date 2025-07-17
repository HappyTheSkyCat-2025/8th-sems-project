// File: BlogPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/blogs.css";
import bali from "../assets/bali.jpg";
import img2 from "../assets/img2.jpg";

const BlogPage = () => {
  return (
    <div className="blog-container">
      {/* Full-width breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> <span className="arrow">›</span>{" "}
        <span>About us</span>
      </nav>

      {/* Content wrapper with 850px width */}
      <div className="blog-inner">
        <div className="top-banner">
          <img src={bali} alt="bali" className="banner-image" />
          <h1 className="banner-title ">
            <span className="indent-2">on</span>
            <br />
            <span className="indent-1">the</span>
            <br />
            <span className="indent-0">blog</span>
          </h1>
        </div>

        <div className="text-image-aligned">
          <div className="text-side">
            <p className="blog-text">
              Golden Leaf Travels is committed to curating unforgettable
              journeys for every traveler. With a passion for exploration and a
              dedication to service, we craft experiences that go beyond the
              ordinary—from the pristine beaches of Bali to the cultural heart
              of Europe. Our travel experts ensure that every itinerary is
              personalized, seamless, and filled with wonder. Whether you're
              chasing adventure, relaxation, or discovery, Golden Leaf Travels
              is your trusted partner in exploring the world.
            </p>
            <p className="blog-text">
              Golden Leaf Travels is committed to curating unforgettable
              journeys for every traveler. With a passion for exploration and a
              dedication to service, we craft experiences that go beyond the
              ordinary—from the pristine beaches of Bali to the cultural heart
              of Europe. Our travel experts ensure that every itinerary is
              personalized, seamless, and filled with wonder. Whether you're
              chasing adventure, relaxation, or discovery, Golden Leaf Travels
              is your trusted partner in exploring the world.
            </p>
          </div>
          <div className="image-side">
            <img src={img2} alt="Golden Journey" className="aligned-image" />
          </div>
        </div>

        <div className="bottom-columns">
          <p>
            Golden Leaf Travels offers custom packages tailored to your
            preferences—from luxury stays to offbeat paths.
          </p>
          <p>
            Experience expert-guided tours, 24/7 support, and exclusive deals
            with a travel agency you can rely on.
          </p>
          <p>
            Start your next adventure with us and turn travel dreams into
            lifetime memories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
