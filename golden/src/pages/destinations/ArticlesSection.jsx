import React from "react";
import { Link } from "react-router-dom"; // Remove if not using React Router
import { article } from "../../data/article";

import img2 from "../../assets/img2.jpg";
import bali from "../../assets/bali.jpg";
import "../../pagescss/article.css";

export default function ArticleSection({
  glanceData = {},
  learnMoreTopics = [],
}) {
  /* -------- Learn‑more default topics -------- */
  const defaultTopics = [
    {
      topic: "Best time to visit",
      description: article.description,
      image: bali,
    },
    {
      topic: "History and Culture",
      description: article.description,
      image: img2,
    },
    {
      topic: "Eating and Drinking",
      description: article.description,
      image: bali,
    },
    {
      topic: "Geography and Environment",
      description: article.description,
      image: img2,
    },
    { topic: "Money Matters", description: article.description, image: bali },
  ];
  const topics = learnMoreTopics.length ? learnMoreTopics : defaultTopics;

  return (
    <>
      {/* ------------ Get inspired on the Good Times ------------ */}
      <section className="inspired-section">
        <h2 className="section-title">Get inspired on the Good Times</h2>

        <div className="inspired-cards">
          {[...Array(3)].map((_, idx) => (
            <article className="inspired-card" key={idx}>
              {/* Image + overlay */}
              <div className="inspired-img-wrapper">
                <img src={img2} alt="Travel inspiration" />
                <div className="inspired-overlay">
                  <p className="location">{article.title}</p>
                  <p className="country">{article.location}</p>

                  {/* clickable link */}
                  <Link to="/articles/kyoto" className="explore-link">
                    Explore &gt;
                  </Link>
                  {/* If you don’t use React Router, swap for: 
                      <a href="#" className="explore-link">Explore &gt;</a> */}
                </div>
              </div>

              {/* Footer */}
              <div className="inspired-footer">
                <p className="tag">Good Trips</p>
                <h3 className="inspired-title">
                  Where to go in 2025 for sun lovers – a month‑by‑month guide
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------ You might also like ------------ */}
      <section className="article-section">
        <div className="article-title-wrapper">
          <h2 className="section-title">You might also like</h2>
          <div className="section-underline1"></div>
        </div>

        <div className="article-card-grid">
          {[...Array(3)].map((_, idx) => (
            <article className="article-card" key={idx}>
              <img src={img2} alt="Article preview" />
              <div className="card-overlay">
                <div className="location-block">
                  <h3>Kyoto</h3>
                  <p>Japan</p>
                </div>
                <a href="#" className="explore-inside-btn">
                  Explore All →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ------------ Country at a glance ------------ */}
      <section className="glance-section">
        <h2>{glanceData.countryName || "Country at a glance"}</h2>

        <div className="glance-grid">
          <div>
            <h4>CAPITAL CITY</h4>
            <p>{glanceData.capital || "-"}</p>
          </div>
          <div>
            <h4>POPULATION</h4>
            <p>{glanceData.population || "-"}</p>
          </div>
          <div>
            <h4>CURRENCY</h4>
            <p>{glanceData.currency || "-"}</p>
          </div>
          <div>
            <h4>LANGUAGE</h4>
            <p>{glanceData.language || "-"}</p>
          </div>
          <div>
            <h4>TIMEZONE</h4>
            <p>{glanceData.timezone || "-"}</p>
          </div>
          <div>
            <h4>CALLINGCODE</h4>
            <p>{glanceData.calling_code || glanceData.callingCode || "-"}</p>
          </div>
          <div className="full-width">
            <h4>ELECTRICITY</h4>
            <p>{glanceData.electricity || "-"}</p>
          </div>
        </div>
      </section>

      {/* ------------ Learn more section ------------ */}
      <section className="learn-section">
        <h2 className="learn-title">
          Learn more about {glanceData.countryName || "Country"}
        </h2>

        {topics.map(({ title, topic, description, image_url, image }, i) => {
          const heading = title || topic || "Untitled";
          const imgSrc = image_url || image || (i % 2 ? img2 : bali);
          const isLeft = i % 2 === 1;

          return (
            <div
              key={`${heading}-${i}`}
              className={`learn-block ${isLeft ? "img-left" : "img-right"}`}
            >
              {isLeft ? (
                <>
                  <div className="learn-img">
                    <img src={imgSrc} alt={heading} />
                  </div>
                  <div className="learn-text">
                    <h3>{heading}</h3>
                    <p>{description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="learn-text">
                    <h3>{heading}</h3>
                    <p>{description}</p>
                  </div>
                  <div className="learn-img">
                    <img src={imgSrc} alt={heading} />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}
