import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Search as SearchIcon, AlertCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/search.css";
import bali from "../assets/bali.jpg";

export default function Search() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endDateError, setEndDateError] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    durationMin: "",
    durationMax: "",
    priceMin: "",
    priceMax: "",
    sale: false,
    lastMinute: false,
    styles: [],
    themes: [],
  });

  const perPage = 15;
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const allResults = new Array(75).fill(0).map((_, i) => ({
    id: i + 1,
    title: `Classic Vietnam ${i + 1}`,
    image: bali,
    days: (i % 15) + 5,
    priceNum: 1000 + (i % 5) * 500,
    price: `$${1000 + (i % 5) * 500}`,
    tag: i % 3 === 0 ? "ON SALE" : null,
    style: ["Basic", "Original", "Premium"][i % 3],
    theme: ["Trekking", "Family", "Food"][i % 3],
    description: "10 days of cultural immersion in Vietnam’s hidden gems.",
  }));

  const filteredResults = useMemo(() => {
    return allResults.filter((item) => {
      const { durationMin, durationMax, priceMin, priceMax, sale, styles, themes } = filters;
      if (durationMin && item.days < durationMin) return false;
      if (durationMax && item.days > durationMax) return false;
      if (priceMin && item.priceNum < priceMin) return false;
      if (priceMax && item.priceNum > priceMax) return false;
      if (sale && item.tag !== "ON SALE") return false;
      if (styles.length && !styles.includes(item.style)) return false;
      if (themes.length && !themes.includes(item.theme)) return false;
      return true;
    });
  }, [filters, allResults]);

  const paginatedResults = filteredResults.slice((page - 1) * perPage, page * perPage);

  const updateFilter = (type, value) => {
    setPage(1);
    if (type === "styles" || type === "themes") {
      setFilters((prev) => {
        const updated = prev[type].includes(value)
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value];
        return { ...prev, [type]: updated };
      });
    } else {
      setFilters((prev) => ({ ...prev, [type]: value }));
    }
  };

  const onStartDateChange = (date) => {
    setStartDate(date);
    setEndDateError("");
    if (endDate && date && endDate < date) {
      setEndDate(null);
    }
  };

  const onEndDateChange = (date) => {
    if (!startDate) {
      setEndDateError("Please select start date first");
      return;
    }
    if (date < startDate) {
      setEndDateError("End date cannot be before start date");
      return;
    }
    setEndDate(date);
    setEndDateError("");
  };

  const onEndCalendarOpen = () => {
    if (!startDate) {
      setEndDateError("Please select start date first");
    }
  };

  return (
    <section className="search-results-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="arrow">›</span>
        <span>Search</span>
      </div>

      <h2 className="search-results-header">
        <span>{filteredResults.length}</span> trips found for <span className="keyword">"Nepal"</span>
      </h2>

      {/* Search Bar */}
      <div className="search-bar-wrapper1">
        <div className="search-bar-container1">
          <div className="search-box1">
            <MapPin size={18} className="icon" />
            <input type="text" placeholder="" />
          </div>

          <div className="vertical-separator"></div>

          <div className="date-inline-box">
            <div className="date-inline-field" ref={startDateRef}>
              <Calendar size={16} className="calendar-icon" />
              <DatePicker
                selected={startDate}
                onChange={onStartDateChange}
                placeholderText="Start date"
                className="inline-datepicker"
                minDate={new Date()}
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>

            <span className="separator">—</span>

            <div className="date-inline-field end-date-wrapper" ref={endDateRef}>
              <Calendar size={16} className="calendar-icon" />
              <DatePicker
                selected={endDate}
                onChange={onEndDateChange}
                onCalendarOpen={onEndCalendarOpen}
                placeholderText="End date"
                className="inline-datepicker"
                minDate={startDate || new Date()}
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>
          </div>

          <button className="search-btn">
            <SearchIcon size={16} /> Search
          </button>
        </div>

        {/* Error message popup */}
        {endDateError && (
          <div className="error-popup" role="alert">
            <AlertCircle size={16} />
            <span>{endDateError}</span>
          </div>
        )}
      </div>

      {/* Filter + Results */}
      <div className="search-layout">
        {/* Filters */}
        <aside className="search-filters">
          <h5>Duration</h5>
          <div className="range-row">
            <input
              type="number"
              placeholder="Min"
              onChange={(e) => updateFilter("durationMin", Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max"
              onChange={(e) => updateFilter("durationMax", Number(e.target.value))}
            />
          </div>

          <h5>Price</h5>
          <div className="range-row">
            <input
              type="number"
              placeholder="$ Min"
              onChange={(e) => updateFilter("priceMin", Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="$ Max"
              onChange={(e) => updateFilter("priceMax", Number(e.target.value))}
            />
          </div>

          <h5>Travel Deals</h5>
          <label>
            <input
              type="checkbox"
              onChange={() => updateFilter("sale", !filters.sale)}
            /> Trips on sale
          </label>

          <h5>Styles</h5>
          {["Basic", "Original", "Premium"].map((style) => (
            <label key={style}>
              <input
                type="checkbox"
                onChange={() => updateFilter("styles", style)}
              /> {style}
            </label>
          ))}

          <h5>Themes</h5>
          {["Trekking", "Family", "Food"].map((theme) => (
            <label key={theme}>
              <input
                type="checkbox"
                onChange={() => updateFilter("themes", theme)}
              /> {theme}
            </label>
          ))}
        </aside>

        {/* Results */}
        <div className="search-grid">
          {paginatedResults.map((result) => (
            <div className="search-card" key={result.id}>
              <div
                className="search-card-img"
                style={{ backgroundImage: `url(${result.image})` }}
              >
                {result.tag && <span className="search-ribbon">{result.tag}</span>}
              </div>
              <div className="search-card-content">
                <h3>{result.title}</h3>
                <p className="excerpt">{result.description}</p>
                <div className="search-card-footer">
                  <button className="details-btn">See Details</button>
                  <div className="price-info">
                    <span className="old-price">${result.priceNum + 400}</span>
                    <span className="new-price">{result.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="search-pagination">
        <span className="icon-btn" onClick={() => setPage((p) => Math.max(1, p - 1))}>◀</span>
        <span>Page {page} of {Math.ceil(filteredResults.length / perPage)}</span>
        <span className="icon-btn" onClick={() => setPage((p) => Math.min(Math.ceil(filteredResults.length / perPage), p + 1))}>▶</span>
      </div>
    </section>
  );
}
