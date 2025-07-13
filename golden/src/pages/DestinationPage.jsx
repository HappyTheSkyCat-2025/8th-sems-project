import React from "react";
import { useParams, Link } from "react-router-dom";
import destinations from "../data/destinations";
import "../pagescss/destination.css";

// Section components
import OverviewSection from "./destinations/OverviewSection";
import DealsSection from "./destinations/DealsSection";
import TripReviewsSection from "./destinations/TripReviewsSection";
import ArticlesSection from "./destinations/ArticlesSection";
import FaqsSection from "./destinations/FaqsSection";
import VideoSection from "./destinations/VideoSection";
import Foot from "../pages/foot";

export default function DestinationPage() {
  const { country } = useParams();
  const key = country?.toLowerCase().replace(/\s|\(|\)|[^a-z]/gi, "");
  const data = destinations[key];

  if (!data) {
    return (
      <div className="destination-wrapper">
        <div className="destination-content">
          <h2>Destination Not Found</h2>
          <p>Sorry, this destination is not in our records.</p>
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-wrapper">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;{" "}
        <Link to="/alldestinations">Destinations</Link>
        &gt; <span>{data.title.split(" ")[0]}</span>
      </nav>

      {/* Hero */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${data.image})` }}
      >
        <div className="hero-text">
          <h1>{data.title}</h1>
          <h3>{data.subtitle}</h3>
        </div>
      </div>
      <div id="overview">
        <OverviewSection data={data} />
      </div>
      {/* Top Tabs */}
      <nav className="top-tabs">
        <ul>
          <li>
            <a href="#overview">Overview</a>
          </li>
          <li>
            <a href="#deals">Travel Deals</a>
          </li>
          <li>
            <a href="#trip-reviews">Trip Reviews</a>
          </li>
          <li>
            <a href="#articles">Articles</a>
          </li>
          <li>
            <a href="#faqs">FAQs</a>
          </li>
          <li>
            <a href="#video">Video</a>
          </li>
        </ul>
      </nav>

      {/* Sections */}

      <div id="deals">
        <DealsSection data={data} />
      </div>
      <div id="trip-reviews">
        <TripReviewsSection />
      </div>
      <div id="articles">
        <ArticlesSection country={country} />
      </div>
      <div id="faqs">
        <FaqsSection />
      </div>
      <div id="video">
        <VideoSection country={country} />
      </div>
      <div id="foot">
        <Foot country={country} />
      </div>
    </div>
  );
}
