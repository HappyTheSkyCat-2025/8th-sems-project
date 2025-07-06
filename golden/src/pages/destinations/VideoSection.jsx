import React from "react";
import homevid1 from "../../assets/homevid1.mp4"; // adjust the path as needed
import "../../pagescss/video.css"; // add this CSS file

export default function VideoSection({ country }) {
  return (
    <div id="video" className="section-block video-section">
      <h2 className="video-title">Watch Travel Video</h2>
      <div className="underline gold" />
      <p className="video-description">
        Experience the beauty and culture of <strong>{country}</strong> in motion! Our travel video gives you a glimpse into what makes this destination unforgettable.
      </p>
      <div className="video-wrapper">
        <video src={homevid1} controls className="responsive-video" />
      </div>
    </div>
  );
}
