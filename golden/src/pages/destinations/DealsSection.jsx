import React, { useState, useMemo, useEffect } from "react";
import {
  FaChevronUp,
  FaChevronDown,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import "../../pagescss/deals.css";

const INITIAL_VISIBLE = 3;

export default function DealsSection({ data = {} }) {
  const dealsArr = Array.isArray(data.deals) ? data.deals : [];

  // ✅ Always declare hooks first
  const [openGrp, setOpenGrp] = useState({ styles: true, themes: true });
  const [liked, setLiked] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minDays: "",
    maxDays: "",
    styles: [],
    themes: [],
    deals: { onSale: false, lastMinute: false },
  });

  useEffect(() => {
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 600);
    return () => clearTimeout(t);
  }, [showAll, filters]);

  const norm = (v = "") => v.toLowerCase().trim();

  const { styleList, styleCount, themeList, themeCount } = useMemo(() => {
    const sC = {},
      tC = {};
    dealsArr.forEach((d) => {
      const sk = norm(d.style || d.Styles);
      if (sk) sC[sk] = (sC[sk] || 0) + 1;
      (d.themes || []).forEach((t) => {
        const tk = norm(t);
        if (tk) tC[tk] = (tC[tk] || 0) + 1;
      });
    });
    return {
      styleList: Object.keys(sC),
      styleCount: sC,
      themeList: Object.keys(tC),
      themeCount: tC,
    };
  }, [dealsArr]);

  const toggleColl = (g) => setOpenGrp((p) => ({ ...p, [g]: !p[g] }));
  const toggleLike = (i) => setLiked((p) => ({ ...p, [i]: !p[i] }));
  const handleCheck = (group, value) =>
    setFilters((p) => {
      if (group === "styles" || group === "themes") {
        const next = new Set(p[group]);
        next.has(value) ? next.delete(value) : next.add(value);
        return { ...p, [group]: [...next] };
      }
      if (group === "deals") {
        return {
          ...p,
          deals: { ...p.deals, [value]: !p.deals[value] },
        };
      }
      return p;
    });

  const filtered = useMemo(() => {
    const {
      minPrice,
      maxPrice,
      minDays,
      maxDays,
      styles,
      themes,
      deals: flags,
    } = filters;
    return dealsArr.filter((d) => {
      const price = +String(d.price).replace(/[^0-9.]/g, "");
      const priceOK =
        (!minPrice || price >= +minPrice) && (!maxPrice || price <= +maxPrice);
      const daysOK =
        (!minDays || d.days >= +minDays) && (!maxDays || d.days <= +maxDays);
      const styleOK =
        styles.length === 0 || styles.includes(norm(d.style || d.Styles));
      const themeOK =
        themes.length === 0 ||
        (d.themes || []).map(norm).some((t) => themes.includes(t));
      const tag = (d.tag || "").toLowerCase();
      const saleOK = !flags.onSale || tag.includes("sale");
      const lmOK = !flags.lastMinute || tag.includes("last minute");
      return priceOK && daysOK && styleOK && themeOK && saleOK && lmOK;
    });
  }, [filters, dealsArr]);

  const display = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  // ✅ Safe early return AFTER hooks
  if (!dealsArr.length) return null;

  return (
    <section className="deals-section" id="travel-deals">
      <h2>Top {data.title?.split(" ")[0]} Travel Deals</h2>

      <div className="deals-layout">
        {/* === Filter Sidebar === */}
        <aside className="filters">
          <h5 className="filters__title">Duration</h5>
          <div className="range-row">
            <input
              type="number"
              placeholder="Min"
              value={filters.minDays}
              onChange={(e) =>
                setFilters({ ...filters, minDays: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxDays}
              onChange={(e) =>
                setFilters({ ...filters, maxDays: e.target.value })
              }
            />
          </div>

          <h5 className="filters__title">Price</h5>
          <div className="range-row">
            <input
              type="number"
              placeholder="$ Min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="$ Max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
          </div>

          <h5 className="filters__title">Travel Deals</h5>
          <label>
            <input
              type="checkbox"
              checked={filters.deals.onSale}
              onChange={() => handleCheck("deals", "onSale")}
            />{" "}
            Trips on sale
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.deals.lastMinute}
              onChange={() => handleCheck("deals", "lastMinute")}
            />{" "}
            Last minute deals
          </label>

          {/* Styles */}
          <div className="collapsible">
            <button
              className="collapsible__header"
              onClick={() => toggleColl("styles")}
            >
              <span>Styles</span>{" "}
              {openGrp.styles ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              className={`collapsible__body ${
                openGrp.styles ? "open" : "closed"
              }`}
            >
              {styleList.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={filters.styles.includes(s)}
                    onChange={() => handleCheck("styles", s)}
                  />
                  {s.charAt(0).toUpperCase() + s.slice(1)}{" "}
                  <span className="count">{styleCount[s]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div className="collapsible">
            <button
              className="collapsible__header"
              onClick={() => toggleColl("themes")}
            >
              <span>Themes</span>{" "}
              {openGrp.themes ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              className={`collapsible__body ${
                openGrp.themes ? "open" : "closed"
              }`}
            >
              {themeList.map((t) => (
                <label key={t}>
                  <input
                    type="checkbox"
                    checked={filters.themes.includes(t)}
                    onChange={() => handleCheck("themes", t)}
                  />
                  {t.charAt(0).toUpperCase() + t.slice(1)}{" "}
                  <span className="count">{themeCount[t]}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* === Cards Grid === */}
        <div className={`deals-grid ${animate ? "reveal" : ""}`}>
          {display.map((d, i) => {
            const priceNum = parseInt(d.price.replace(/[^0-9]/g, "") || 0, 10);
            const oldPrice = `$${(priceNum + 500).toLocaleString()}`;
            return (
              <article
                className="deal-card screenshot"
                key={i}
                style={{ "--i": i }}
              >
                <div
                  className="deal-image"
                  style={{ backgroundImage: `url(${d.image})` }}
                >
                  {d.tag && <span className="ribbon">{d.tag}</span>}
                  <button
                    className={`fav-btn ${liked[i] ? "liked" : ""}`}
                    onClick={() => toggleLike(i)}
                  >
                    {liked[i] ? <FaHeart /> : <FaRegHeart />}
                  </button>

                  <div className="deal-overlay sc">
                    <h3>{d.title}</h3>
                    <p className="excerpt">
                      10 days of cultural immersion and relaxation in
                      Indonesia's paradise
                    </p>
                    <div className="badge-row">
                      <span className="info-badge">{d.days} days</span>
                      {d.themes?.[0] && (
                        <span className="info-badge second">{d.themes[0]}</span>
                      )}
                    </div>
                    <div className="bottom-row">
                      <button className="deal-btn small">See Details</button>
                      <div className="price-wrap">
                        <span className="old-price">{oldPrice}</span>
                        <span className="new-price">{d.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && <p>No trips match your filters.</p>}
        </div>
      </div>

      {/* View More / Less Button */}
      {filtered.length > INITIAL_VISIBLE && (
        <div className="view-more-wrapper">
          <button
            className="view-more-btn"
            onClick={() => {
              setShowAll((prev) => {
                const next = !prev;
                if (!next) {
                  setTimeout(() => {
                    const el = document.getElementById("travel-deals");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }
                return next;
              });
            }}
          >
            {showAll ? "View less ▲" : "View more trips ▼"}
          </button>
        </div>
      )}
    </section>
  );
}
