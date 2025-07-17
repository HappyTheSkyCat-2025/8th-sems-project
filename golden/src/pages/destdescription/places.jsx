import React from "react";
import "../../pagescss/places.css";
import img1 from "../../assets/img2.jpg";
import bali from "../../assets/bali.jpg";

export default function Places({ data }) {
  // Build location string for map iframe
  const location = data?.city
    ? encodeURIComponent(`${data.city}, ${data.country.name}`)
    : encodeURIComponent(data?.country?.name || "");

  // Use map_zoom from data or fallback to 5
  const zoom = data?.map_zoom || 5;

  // Google Maps embed URL (public embed, no API key needed)
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCtjLO8Wck6hjPYM5LScc2pG6y6NUy7ms0&q=${location}&zoom=${zoom}`;

  return (
    <>
      <section className="places-section">
        <h2 className="places-title">Places You’ll See</h2>
        <div className="places-cards">
          <div className="place-card">
            <img src={img1} alt="Place 1" />
            <div className="place-info">
              <h4>Kyoto</h4>
              <p>Japan</p>
            </div>
          </div>
          <div className="place-card">
            <img src={bali} alt="Place 2" />
            <div className="place-info">
              <h4>Chiang Mai</h4>
              <p>Thailand</p>
            </div>
          </div>
          <div className="place-card">
            <img src={img1} alt="Place 3" />
            <div className="place-info">
              <h4>Hoi An</h4>
              <p>Vietnam</p>
            </div>
          </div>
        </div>

        <div className="map-section">
          <iframe
            title={`${data?.city || data?.country?.name} Map`}
            src={mapSrc}
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: "16px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <button className="view-destinations-btn">📍 View Destinations</button>
        </div>
      </section>

      {/* Full-width overview */}
      <div className="overview-full-width">
        <div className="overview-section">
          <h2 className="overview-title">Overview</h2>
          <h3 className="overview-subtitle">
            Discover the cultural charm, fresh food and dramatic landscapes of Vietnam
          </h3>
          <p className="overview-description">
            From south to north, Vietnam is a kaleidoscope of welcoming locals, varied cuisine and diverse landscapes. Unlock the mysteries of the Viet Minh in Ho Chi Minh City, explore the beautiful lakes and boulevards of Hanoi, mingle with the locals while staying at a Mekong Delta guesthouse, float to sleep on a traditional junk boat in Halong Bay, and eat breakfast the local way in Hue. Experience historical temples, laze on the spectacular coastline, gorge on delicious banquets and explore lively cities – all with a touch of comfort – on this 15-day Classic Vietnam adventure.
          </p>
        </div>
      </div>
    </>
  );
}
