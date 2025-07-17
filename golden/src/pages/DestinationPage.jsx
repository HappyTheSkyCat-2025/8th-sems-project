import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get(`/destinations/countries/${country}/`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch country data:", err);
        setData(null);
        setLoading(false);
      });
  }, [country]);

  if (loading) {
    return <div className="destination-wrapper">Loading...</div>;
  }

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

  // Categorize articles properly
  const inspirationalArticles = data.articles?.filter((a) => a.is_inspirational) || [];
  const suggestedArticles = data.articles?.filter((a) => a.is_suggested) || [];
  const regularArticles =
    data.articles?.filter((a) => !a.is_inspirational && !a.is_suggested) || [];

  return (
    <div className="destination-wrapper">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;{" "}
        <Link to="/alldestinations">Destinations</Link> &gt;{" "}
        <span>{data.name}</span>
      </nav>

      {/* Hero */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${data.image})` }}
      >
        <div className="hero-text">
          <h1>{data.name}</h1>
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
            <a href="#travel-deals">Travel Deals</a>
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
      <div id="travel-deals">
        <DealsSection data={{ deals: data.deals, title: data.name }} />
      </div>

      <div id="trip-reviews">
        <TripReviewsSection reviews={data.reviews} />
      </div>

      <div id="articles">
        <ArticlesSection
          inspirations={inspirationalArticles}
          suggestedArticles={suggestedArticles}
          regularArticles={regularArticles}
          country={data.name}
          learnMoreTopics={data.learn_more_topics || []}
          glanceData={{ countryName: data.name, ...data.overview }}
        />
      </div>

      <div id="faqs">
        <FaqsSection faqs={data.faqs} />
      </div>

      <div id="video">
        <VideoSection videoUrl={data.video_url} country={data.name} />
      </div>

      <div id="foot">
        <Foot country={data.name} />
      </div>
    </div>
  );
}
