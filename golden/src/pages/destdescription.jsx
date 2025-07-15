import React, { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Desc from "./destdescription/desc";
import Feat from "./destdescription/feat";
import Places from "./destdescription/places";
import Included from "./destdescription/included";
import Reviewplaces from "./destdescription/reviewplaces";
import Dates from "./destdescription/dates";
import Foot from "../pages/foot";
import "../pagescss/destdescription.css";
import axios from "axios";

export default function DestDescription() {
  const { country, dealId: dealSlug } = useParams();
  const datesRef = useRef(null);

  const [dealData, setDealData] = useState(null);
  const [reviews, setReviews] = useState([]);  // <-- NEW state for reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollToDates = () => {
    if (datesRef.current) {
      datesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch deal data and reviews concurrently
    const fetchDeal = axios.get(`/api/destinations/countries/${country}/travel-deals/${dealSlug}/`);
    const fetchReviews = axios.get(`/api/destinations/countries/${country}/travel-deals/${dealSlug}/reviews/`);

    Promise.all([fetchDeal, fetchReviews])
      .then(([dealRes, reviewsRes]) => {
        setDealData(dealRes.data);

        // Extract review list from paginated API response
        const reviewsData = Array.isArray(reviewsRes.data)
          ? reviewsRes.data
          : reviewsRes.data.results || [];
        setReviews(reviewsData);
      })
      .catch(() => {
        setError("Failed to load travel deal or reviews.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [country, dealSlug]);

  if (loading) return <div>Loading travel deal...</div>;
  if (error) return <div>{error}</div>;
  if (!dealData) return <div>No travel deal found.</div>;

  // Calculate average rating and review count here for Desc
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  // Pass rating info as part of dealData to Desc
  const descData = {
    ...dealData,
    review_count: reviewCount,
    average_rating: averageRating,
  };

  return (
    <div className="dest-description-container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;{" "}
        <Link to="/alldestinations">Destinations</Link> &gt;{" "}
        <Link to={`/destinations/${country}`}>{country}</Link> &gt;{" "}
        <span>{dealData.title}</span>
      </nav>

      <Desc data={descData} onViewDatesClick={scrollToDates} />
      <Places data={dealData} />
      <Feat data={dealData} />
      <Included data={dealData} />
      <div ref={datesRef}>
        <Dates data={dealData} />
      </div>

      {/* Pass reviews and setter to Reviewplaces */}
      <Reviewplaces data={dealData} reviews={reviews} setReviews={setReviews} />

      <Foot />
    </div>
  );
}
