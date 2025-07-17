import React from "react";
import { Link } from "react-router-dom";
import img2 from "../../assets/img2.jpg";
import bali from "../../assets/bali.jpg";
import "../../pagescss/article.css";

export default function ArticlesSection({
  glanceData = {},
  learnMoreTopics = [],
  inspirations = [],
  suggestedArticles = [],
  regularArticles = [],
}) {
  const defaultTopics = [
    { topic: "Best time to visit", description: "Plan your travel timing.", image: bali },
    { topic: "History and Culture", description: "Explore the cultural depth.", image: img2 },
    { topic: "Eating and Drinking", description: "Local cuisine insights.", image: bali },
    { topic: "Geography and Environment", description: "Understand the terrain.", image: img2 },
    { topic: "Money Matters", description: "Currency, cost, and more.", image: bali },
  ];

  const topics = learnMoreTopics.length ? learnMoreTopics : defaultTopics;

  return (
    <>
      {/* ------------ Inspirations ------------ */}
      <section className="inspired-section">
        <h2 className="section-title">Get inspired on the Good Times</h2>
        <div className="inspired-cards">
          {inspirations.length > 0 ? (
            inspirations.map((article) => (
              <article className="inspired-card" key={article.id}>
                <div className="inspired-img-wrapper">
                  <img
                    src={article.image || img2}
                    alt={article.title || "Inspirational article"}
                  />
                  <div className="inspired-overlay">
                    <p className="location">{article.title || "Untitled"}</p>
                    <p className="country">{article.location || glanceData.countryName || ""}</p>
                    <Link
                      to={`/articles/${article.slug || "#"}`}
                      className="explore-link"
                      aria-label={`Explore article: ${article.title || "Untitled"}`}
                    >
                      Explore &gt;
                    </Link>
                  </div>
                </div>
                <div className="inspired-footer">
                  <p className="tag">Good Trips</p>
                  <h3 className="inspired-title">{article.subtitle || article.title || "Untitled"}</h3>
                </div>
              </article>
            ))
          ) : (
            <p>No inspirational articles found.</p>
          )}
        </div>
      </section>

      {/* ------------ Suggested Articles ------------ */}
      <section className="article-section">
        <div className="article-title-wrapper">
          <h2 className="section-title">You might also like</h2>
          <div className="section-underline1"></div>
        </div>
        <div className="article-card-grid">
          {suggestedArticles.length > 0 ? (
            suggestedArticles.map((article) => (
              <article className="article-card" key={article.id}>
                <img
                  src={article.image || img2}
                  alt={article.title || "Article preview"}
                />
                <div className="card-overlay">
                  <div className="location-block">
                    <h3>{article.title || "Untitled"}</h3>
                    <p>{article.location || glanceData.countryName || ""}</p>
                  </div>
                  <Link
                    to={`/articles/${article.slug || "#"}`}
                    className="explore-inside-btn"
                    aria-label={`Explore suggested article: ${article.title || "Untitled"}`}
                  >
                    Explore All →
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p>No suggested articles available.</p>
          )}
        </div>
      </section>

      {/* ------------ Regular Articles ------------ */}
      {regularArticles.length > 0 && (
        <section className="regular-articles-section">
          <h2 className="section-title">More Articles</h2>
          <div className="regular-articles-grid">
            {regularArticles.map((article) => (
              <article className="regular-article-card" key={article.id}>
                <img
                  src={article.image || img2}
                  alt={article.title || "Article preview"}
                />
                <div className="card-overlay">
                  <div className="location-block">
                    <h3>{article.title || "Untitled"}</h3>
                    <p>{article.location || glanceData.countryName || ""}</p>
                  </div>
                  <Link
                    to={`/articles/${article.slug || "#"}`}
                    className="explore-inside-btn"
                    aria-label={`Explore article: ${article.title || "Untitled"}`}
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

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

      {/* ------------ Learn More ------------ */}
      <section className="learn-section">
        <h2 className="learn-title">Learn more about {glanceData.countryName || "this country"}</h2>
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
