import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import '../styles/Home.css';
import homevid1 from '../assets/homevid1.mp4';

export default function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <section className="home-section">
      <video autoPlay muted loop className="home-video">
        <source src={homevid1} type="video/mp4" />
      </video>

      <div className="overlay">
        <div className="home-content">
          <h1 className="hero-title">Find Your Perfect Journey</h1>
          <p className="hero-description">
            Explore handpicked destinations and customize your travel experiences. Where will you go next?
          </p>

          {/* Search Bar */}
          <div className="search-bar-container">
            {/* Search input */}
            <div className="search-box">
              <MapPin size={18} className="icon" />
              <input type="text" placeholder="Search" />
            </div>

            {/* Date range without calendar icon */}
            <div className="date-box">
              <input
                type="text"
                placeholder="Start date"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="separator">—</span>
              <input
                type="text"
                placeholder="End date"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Search button */}
            <button className="search-btn">
              Search <Search size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
