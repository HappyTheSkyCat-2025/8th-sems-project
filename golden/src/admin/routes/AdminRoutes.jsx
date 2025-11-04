import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import UserList from "../pages/UserList";
import Newsletter from "../pages/Newsletter";
import Story from "../pages/story";
import BlogList from "../pages/BlogList";
import BookingList from "../pages/BookingList";
import ContactList from "../pages/ContactList";

/* Payments */
import PaymentMethod from "../pages/payment/payment";
import UserStatus from "../pages/payment/userstat";
import BookingDetails from "../pages/payment/booking";

/* Destinations */
import Article from "../pages/destinations/article";
import Learn from "../pages/destinations/learn";
import Country from "../pages/destinations/country";
import Countries from "../pages/destinations/countries";
import Deal from "../pages/destinations/deal";
import FAQ from "../pages/destinations/faq";
import Places from "../pages/destinations/places";
import Region from "../pages/destinations/region";
import Reviews from "../pages/destinations/reviews";
import TravelDealList from "../pages/destinations/deals";
import TravelDealDateList from "../pages/destinations/dates";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Dashboard & Basics */}
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="stories" element={<Story />} />
        <Route path="blogs" element={<BlogList />} />
        <Route path="bookings" element={<BookingList />} />
        <Route path="contacts" element={<ContactList />} />

        {/* Payments */}
        <Route path="payment-method" element={<PaymentMethod />} />
        <Route path="user-status" element={<UserStatus />} />
        <Route path="booking-details" element={<BookingDetails />} />

        {/* Destinations */}
        <Route path="article" element={<Article />} />
        <Route path="learn" element={<Learn />} />
        <Route path="country" element={<Country />} />
        <Route path="countries" element={<Countries />} />
        <Route path="deal" element={<Deal />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="places" element={<Places />} />
        <Route path="region" element={<Region />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="travel-deals" element={<TravelDealList />} />
        <Route path="travel-deal-dates" element={<TravelDealDateList />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
