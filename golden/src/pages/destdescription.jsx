import React from "react";
import { useParams, Link } from "react-router-dom";
import Desc from "./destdescription/desc";
import Feat from "./destdescription/feat";
import Places from "./destdescription/places";
import "../pagescss/destdescription.css";

export default function DestDescription() {
  const { country, dealId } = useParams();

  return (
    <div className="dest-description-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &gt;{" "}
        <Link to="/destinations">Destinations</Link> &gt;{" "}
        <Link to={`/destinations/${country}`}>{country}</Link> &gt;{" "}
        <span>{dealId}</span>
      </nav>
      <Desc />
      <Places />
      <Feat />
    </div>
  );
}
