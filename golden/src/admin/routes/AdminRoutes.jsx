import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import AdminDashboard from '../pages/AdminDashboard';
import BlogList from '../pages/BlogList';
import UserList from '../pages/UserList';
import ContactList from "../pages/ContactList";
import BookingList from '../pages/BookingList';
import RegionList from '../pages/RegionList';
import CountryList from '../pages/CountryList';
import TravelDealList from '../pages/TravelDealList';
import TravelDealDateList from '../pages/TravelDealDateList';
import Newsletter from '../pages/Newsletter'; 

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="Newsletter" element={<Newsletter />} />  
        <Route path="blogs" element={<BlogList />} />
        <Route path="contacts" element={<ContactList />} />
        <Route path="bookings" element={<BookingList />} />
        <Route path="regions" element={<RegionList />} />
        <Route path="countries" element={<CountryList />} />
        <Route path="travel-deals" element={<TravelDealList />} />
        <Route path="travel-deal-dates" element={<TravelDealDateList />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
