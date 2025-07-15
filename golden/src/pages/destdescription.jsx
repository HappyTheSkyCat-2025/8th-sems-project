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
  const [reviews, setReviews] = useState([]);
  const [dates, setDates] = useState([]);
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

    const fetchDeal = axios.get(`/api/destinations/countries/${country}/travel-deals/${dealSlug}/`);
    const fetchReviews = axios.get(`/api/destinations/countries/${country}/travel-deals/${dealSlug}/reviews/`);
    const fetchDates = axios.get(`/api/destinations/countries/${country}/travel-deals/${dealSlug}/dates/`);

    Promise.all([fetchDeal, fetchReviews, fetchDates])
      .then(([dealRes, reviewsRes, datesRes]) => {
        setDealData(dealRes.data);

        const reviewsData = Array.isArray(reviewsRes.data)
          ? reviewsRes.data
          : reviewsRes.data.results || [];
        setReviews(reviewsData);

        const datesData = Array.isArray(datesRes.data)
          ? datesRes.data
          : datesRes.data.results || [];
        setDates(datesData);
      })
      .catch(() => {
        setError("Failed to load travel deal, reviews, or dates.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [country, dealSlug]);

  if (loading) return <div>Loading travel deal...</div>;
  if (error) return <div>{error}</div>;
  if (!dealData) return <div>No travel deal found.</div>;

  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

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
        {/* Pass dealData.id to Dates */}
        <Dates data={dates} dealId={dealData.id} />
      </div>
      <Reviewplaces data={dealData} reviews={reviews} setReviews={setReviews} />
      <Foot />
    </div>
  );
}
