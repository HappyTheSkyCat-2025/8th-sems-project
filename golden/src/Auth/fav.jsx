import React from "react";
import "../styles/fav.css";
import { Heart } from "lucide-react";
import favImage from "../assets/bali.jpg"; 

const packages = [
  {
    id: 1,
    title: "Santorini Sunset Getaway",
    price: "$1,599",
    image: favImage,
  },
  {
    id: 2,
    title: "Santorini Sunset Getaway",
    price: "$1,599",
    image: favImage,
  },
  {
    id: 3,
    title: "Santorini Sunset Getaway",
    price: "$1,599",
    image: favImage,
  },
];

export default function FavouritePackages() {
  return (
    <div className="fav-container">
      <h3 className="fav-heading">Favourite Packages</h3>
      <div className="fav-cards">
        {packages.map((pkg) => (
          <div className="fav-card" key={pkg.id}>
            <div className="fav-image-container">
              <img src={pkg.image} alt={pkg.title} className="fav-image" />
              <Heart className="fav-heart" color="#f44336" fill="white" strokeWidth={2} />
            </div>
            <div className="fav-content">
              <h4 className="fav-title">{pkg.title}</h4>
              <p className="fav-price">{pkg.price}</p>
              <button className="fav-book-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
