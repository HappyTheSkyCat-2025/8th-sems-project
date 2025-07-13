import React, { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Desc from "./destdescription/desc";
import Feat from "./destdescription/feat";
import Places from "./destdescription/places";
import Included from "./destdescription/included";
import Reviewplaces from "./destdescription/reviewplaces";
import Dates from "./destdescription/dates";
import Foot from "../pages/foot";
import "../pagescss/destdescription.css";

export default function DestDescription() {
  const { country, dealId } = useParams();
  const datesRef = useRef(null);

  // Scroll handler for "View Dates And Book" button
  const scrollToDates = () => {
    if (datesRef.current) {
      datesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="dest-description-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;{" "}
        <Link to="/AllDestinations">Destinations</Link>
        &gt; <Link to={`/destinations/${country}`}>{country}</Link> &gt;{" "}
        <span>{dealId}</span>
      </nav>

      <Desc onViewDatesClick={scrollToDates} />
      <Places />
      <Feat />
      <Included />
      <div ref={datesRef}>
        <Dates />
      </div>
      <Reviewplaces />
      <Foot />
    </div>
  );
}
