import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import "../styles/blogs.css";

import bali from "../assets/bali.jpg";
import img2 from "../assets/img2.jpg";

import { blogs as allBlogs, testimonialsData } from "../data/blog";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="blog-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> <span className="arrow">›</span>
        <span>About us</span>
      </nav>

      {/* Main 850px Content */}
      <div className="blog-inner">
        <div className="top-banner">
          <img src={bali} alt="bali" className="banner-image" />
          <h1 className="banner-title">
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
              Golden Leaf Travels is committed to curating unforgettable journeys for every traveler. With a passion for exploration and a dedication to service, we craft experiences that go beyond the ordinary—from the pristine beaches of Bali to the cultural heart of Europe.
            </p>
            <p className="blog-text">
              Our travel experts ensure that every itinerary is personalized, seamless, and filled with wonder. Whether you're chasing adventure, relaxation, or discovery, Golden Leaf Travels is your trusted partner in exploring the world.
            </p>
          </div>
          <div className="image-side">
            <img src={img2} alt="Golden Journey" className="aligned-image" />
          </div>
        </div>

        <div className="bottom-columns">
          <p>Golden Leaf Travels offers custom packages tailored to your preferences—from luxury stays to offbeat paths.</p>
          <p>Experience expert-guided tours, 24/7 support, and exclusive deals with a travel agency you can rely on.</p>
          <p>Start your next adventure with us and turn travel dreams into lifetime memories.</p>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonial-section">
        <h2 className="testimonial-title">What People Says</h2>
        <div className="testimonial-container">
          {/* Left Blog Cards */}
          <div className="testimonial-left">
            {filteredBlogs.length ? (
              filteredBlogs.map((blog, index) => (
                <div className="testimonial-card" key={index}>
                  <img src={blog.img} alt={blog.title} className="testimonial-image" />
                  <div className="testimonial-info">
                    <div className="author-block">
                      <img
                        src={testimonialsData[index % testimonialsData.length].img}
                        alt="Author"
                        className="author-img"
                      />
                      <div className="author-info">
                        <span className="author-name">{testimonialsData[index % testimonialsData.length].name}</span>
                        <small className="author-job">{testimonialsData[index % testimonialsData.length].job}</small>
                      </div>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.desc}</p>
                    <a href="#" className="explore-btn">
                      Explore More <span>↗</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No blogs found matching your search.</p>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="testimonial-right">
            {/* Search Box */}
            <div className="search-box">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search blog titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                  <CiSearch size={20} />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="categories">
              <h3>Categories</h3>
              <ul>
                <li>✶ Adventure <span>2</span></li>
                <li>✶ City Tours <span>4</span></li>
                <li>✶ Cruises Tour <span>3</span></li>
                <li>✶ Sea Tour <span>2</span></li>
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="recent-posts">
              <h3>Recent Posts</h3>
              <ul>
                {allBlogs.slice(0, 4).map((recent, i) => (
                  <li key={i}>
                    <img src={recent.img} alt="Recent Post" />
                    <div>
                      <span>📅 {recent.date}</span>
                      <p>{recent.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
