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
  const { country, dealId } = useParams();
  const datesRef = useRef(null);

  const [dealData, setDealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Scroll handler for "View Dates And Book" button
  const scrollToDates = () => {
    if (datesRef.current) {
      datesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`/api/destinations/countries/${country}/travel-deals/${dealId}/`)
      .then((response) => {
        setDealData(response.data);
      })
      .catch(() => {
        setError("Failed to load deal data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [country, dealId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!dealData) return <div>No data found.</div>;

  return (
    <div className="dest-description-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;{" "}
        <Link to="/AllDestinations">Destinations</Link> &gt;{" "}
        <Link to={`/destinations/${country}`}>{country}</Link> &gt;{" "}
        <span>{dealData.title || dealId}</span>
      </nav>

      {/* Pass dealData as props to children */}
      <Desc data={dealData} onViewDatesClick={scrollToDates} />
      <Places data={dealData} />
      <Feat data={dealData} />
      <Included data={dealData} />
      <div ref={datesRef}>
        <Dates data={dealData} />
      </div>
      <Reviewplaces data={dealData} />
      <Foot />
    </div>
  );
}
