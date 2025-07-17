import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../pagescss/places.css";
import img1 from "../../assets/img2.jpg";
import bali from "../../assets/bali.jpg";

// Fix Leaflet marker icons (important!)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Places({ data }) {
  const locationName = data?.city
    ? `${data.city}, ${data.country.name}`
    : data?.country?.name;

  const [coordinates, setCoordinates] = useState([0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = data?.city
      ? `${data.city}, ${data.country.name}`
      : data?.country?.name;

    if (!query) {
      setLoading(false);
      return;
    }

    const fetchCoordinates = async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=1`;

        const response = await fetch(url);
        const jsonData = await response.json();

        if (jsonData && jsonData.length > 0) {
          setCoordinates([parseFloat(jsonData[0].lat), parseFloat(jsonData[0].lon)]);
        } else {
          setCoordinates([0, 0]);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setCoordinates([0, 0]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [data?.city, data?.country]);

  const zoom = data?.map_zoom || 5;

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
          {loading ? (
            <p>Loading map...</p>
          ) : (
            <MapContainer
              center={coordinates}
              zoom={zoom}
              style={{ height: "450px", borderRadius: "16px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={coordinates}>
                <Popup>{locationName}</Popup>
              </Marker>
            </MapContainer>
          )}
          <button className="view-destinations-btn">📍 View Destinations</button>
        </div>
      </section>

      <div className="overview-full-width">
        <div className="overview-section">
          <h2 className="overview-title">Overview</h2>
          <h3 className="overview-subtitle">
            Discover the cultural charm, fresh food and dramatic landscapes of
            Vietnam
          </h3>
          <p className="overview-description">
            From south to north, Vietnam is a kaleidoscope of welcoming locals,
            varied cuisine and diverse landscapes. Unlock the mysteries of the
            Viet Minh in Ho Chi Minh City, explore the beautiful lakes and
            boulevards of Hanoi, mingle with the locals while staying at a
            Mekong Delta guesthouse, float to sleep on a traditional junk boat
            in Halong Bay, and eat breakfast the local way in Hue. Experience
            historical temples, laze on the spectacular coastline, gorge on
            delicious banquets and explore lively cities – all with a touch of
            comfort – on this 15-day Classic Vietnam adventure.
          </p>
        </div>
      </div>
    </>
  );
}
