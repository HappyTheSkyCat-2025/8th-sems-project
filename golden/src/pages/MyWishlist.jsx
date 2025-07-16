import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../pagescss/deals.css";

export default function MyWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const didRedirectRef = useRef(false); // Track if redirect happened

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      if (!didRedirectRef.current) {
        toast.info("Please log in to view your wishlist");
        didRedirectRef.current = true; // Prevent showing toast twice
        navigate("/login");
      }
      return;
    }

    // Using custom axios instance
    axiosInstance
      .get("/destinations/wishlist/")
      .then((res) => setWishlist(res.data.results || []))
      .catch(() => toast.error("Failed to load wishlist"));
  }, [navigate]);

  const slugify = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-heading">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <div className="deals-grid">
          {wishlist.map((deal, i) => (
            <article className="deal-card" key={deal.id} style={{ "--i": i }}>
              <div
                className="deal-image"
                style={{
                  backgroundImage: `url(${deal.deal_image || "https://via.placeholder.com/300"})`,
                }}
              >
                <button className="fav-btn liked" disabled>
                  <FaHeart />
                </button>

                <div className="deal-overlay sc">
                  <h3>{deal.deal_title}</h3>
                  <p className="excerpt">
                    Explore this amazing travel deal you loved.
                  </p>
                  <div className="bottom-row">
                    <button
                      className="deal-btn small"
                      onClick={() =>
                        navigate(
                          `/destinations/${deal.deal_country_slug}/deal/${slugify(
                            deal.deal_title
                          )}`
                        )
                      }
                    >
                      See Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
