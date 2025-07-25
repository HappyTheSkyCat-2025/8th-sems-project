import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../AdminLayout';
import AdminDashboard from '../pages/AdminDashboard';
import BlogList from '../pages/BlogList';
import UserList from '../pages/UserList';
import ContactList from "../pages/ContactList";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserList />} />
        <Route path="blogs" element={<BlogList />} />
        <Route path="contacts" element={<ContactList />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
