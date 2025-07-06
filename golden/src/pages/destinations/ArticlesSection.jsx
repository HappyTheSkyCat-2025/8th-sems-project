import React from "react";
import { article } from "../../data/article";
import img2 from "../../assets/img2.jpg";
import bali from "../../assets/bali.jpg";
import "../../pagescss/article.css";

export default function ArticleSection() {
  return (
    <>
      {/* Get inspired on the Good Times */}
      <div className="inspired-section">
        <h2 className="section-title">Get inspired on the Good Times</h2>
        <div className="inspired-cards">
          {[...Array(3)].map((_, index) => (
            <div className="inspired-card" key={index}>
              <img src={img2} alt="travel" />
              <div className="inspired-overlay">
                <span className="location">{article.title}</span>
                <span className="country">{article.location}</span>
                <span className="explore-link">Explore &gt;</span>
              </div>
              <div className="inspired-footer">
                <p className="tag">Good Trips</p>
                <h4 className="inspired-title">
                  Where to go in 2025 for sund lovers - a month-by-month guide
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* You might also like */}
      <div className="article-section">
        <h2 className="section-title">You might also like</h2>
        <div className="article-cards">
          {[...Array(4)].map((_, index) => (
            <div className="article-card" key={index}>
              <img src={img2} alt="article" />
              <div className="card-overlay">
                <h3>{article.title}</h3>
                <p>{article.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vietnam at a glance */}
      <div className="glance-section">
        <h2>Vietnam at a glance</h2>
        <div className="glance-grid">
          <div><h4>CAPITAL CITY</h4><p>{article.capital}</p></div>
          <div><h4>POPULATION</h4><p>{article.population}</p></div>
          <div><h4>CURRENCY</h4><p>{article.currency}</p></div>
          <div><h4>LANGUAGE</h4><p>{article.language}</p></div>
          <div><h4>TIME ZONE</h4><p>{article.timezone}</p></div>
          <div><h4>CALLING CODE</h4><p>{article.callingCode}</p></div>
          <div className="full-width"><h4>ELECTRICITY</h4><p>{article.electricity}</p></div>
        </div>
      </div>

      {/* Learn more about Vietnam */}
      <div className="learn-section">
        <h2 className="learn-title">Learn more about Vietnam</h2>

        {[
          "Best time to visit",
          "History and Culture",
          "Eating and Drinking",
          "Geography and Environment",
          "Money Matters"
        ].map((topic, i) => (
          <div
            className={`learn-block ${i % 2 === 0 ? "img-right" : "img-left"}`}
            key={topic}
          >
            {i % 2 === 0 ? (
              <>
                <div className="learn-text">
                  <h3>{topic}</h3>
                  <p>{article.description}</p>
                </div>
                <div className="learn-img">
                  <img src={bali} alt={topic} />
                </div>
              </>
            ) : (
              <>
                <div className="learn-img">
                  <img src={img2} alt={topic} />
                </div>
                <div className="learn-text">
                  <h3>{topic}</h3>
                  <p>{article.description}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
