import React from "react";
import "../../pagescss/overview.css";

export default function OverviewSection({ data }) {
  return (
    <div id="overview" className="overview-section">
      <h2>{data.sectionTitle}</h2>
      <div className="underline gold" />
      <p>{data.description}</p>
    </div>
  );
}
