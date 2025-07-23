// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";

// Layout components
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatBot from "./components/chatbot";

// Auth pages
import Login from "./Auth/login";
import Register from "./Auth/Register";
import VerifyOTP from "./Auth/VerifyOTP";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import Profile from "./Auth/profile";
import ChangePassword from "./Auth/ChangePassword";
import BookingDetail from "./Auth/BookingDetail";

// Home page sections
import Home from "./components/Home";
import Readsection3rd from "./components/readsection3rd";
import Journey from "./components/journey";
import Whygolden from "./components/Whygolden";
import Stories from "./components/stories";
import Trending from "./components/trending";
import Roof from "./components/roof";
import Trip from "./components/trip";
import Journal from "./components/journal";

// Pages
import AboutUs from "./pages/Aboutus";
import AllDestinations from "./pages/AllDestinations";
import DestinationPage from "./pages/DestinationPage";
import DestDescription from "./pages/destdescription";
import Blogs from "./pages/blogs";
import Write from "./pages/write";

// Search Page
import Search from "./components/search";

// Payment pages
import Payment1 from "./payment/payment1";
import Payment2 from "./payment/payment2";
import Payment3 from "./payment/payment3";
import ThankYou from "./payment/ThankYou";

// Admin Pages and utilities
import RequireAdmin from "./utils/RequireAdmin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import RegionList from "./components/admin/regions/RegionList";
import RegionForm from "./components/admin/regions/RegionForm";
import CountryList from "./components/admin/countries/CountryList";
import CountryForm from "./components/admin/countries/CountryForm";
import TravelDealList from "./components/admin/travel-deals/TravelDealList";
import TravelDealForm from "./components/admin/travel-deals/TravelDealForm";
import FAQList from "./components/admin/faqs/FAQList";
import FAQForm from "./components/admin/faqs/FAQForm";
import ReviewList from "./components/admin/reviews/ReviewList";
import ReviewForm from "./components/admin/reviews/ReviewForm";
import CountryOverviewList from "./components/admin/country-overview/CountryOverviewList";
import CountryOverviewForm from "./components/admin/country-overview/CountryOverviewForm";
import LearnMoreTopicList from "./components/admin/learn-more-topics/LearnMoreTopicList";
import LearnMoreTopicForm from "./components/admin/learn-more-topics/LearnMoreTopicForm";

// Toastify
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function Layout() {
  const location = useLocation();

  const noLayoutRoutes = [
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/change-password",
    "/payment/payment1",
    "/payment/payment2",
    "/payment/payment3",
    "/thank-you",
  ];

  const adminRoutes = [
    "/admin",
    "/admin/regions",
    "/admin/regions/create",
    "/admin/regions/:id/edit",
    "/admin/countries",
    "/admin/countries/create",
    "/admin/countries/:slug/edit",
  ];

  const hideLayout =
    noLayoutRoutes.some((path) =>
      matchPath({ path, end: false }, location.pathname)
    ) ||
    adminRoutes.some((path) =>
      location.pathname.startsWith(path.replace(":id", "").replace(":slug", ""))
    );

  const authRoutes = [
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/change-password",
  ];

  const paymentPaths = [
    "/payment/payment1",
    "/payment/payment2",
    "/payment/payment3",
    "/thank-you",
  ];

  const showChatBot = ![...authRoutes, ...paymentPaths].some((path) =>
    matchPath({ path, end: false }, location.pathname)
  );

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <Readsection3rd />
              <Journey />
              <Whygolden />
              <Stories />
              <Trending />
              <Roof />
              <Trip />
              <Journal />
            </>
          }
        />
        <Route path="/alldestinations" element={<AllDestinations />} />
        <Route path="/destinations/:country" element={<DestinationPage />} />
        <Route
          path="/destinations/:country/deal/:dealId"
          element={<DestDescription />}
        />
        <Route path="/about" element={<AboutUs />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />

        {/* Payment Routes */}
        <Route path="/payment/payment1" element={<Payment1 />} />
        <Route path="/payment/payment2/:id" element={<Payment2 />} />
        <Route path="/payment/payment3/:id" element={<Payment3 />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* Blogs */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/write" element={<Write />} />

        {/* Search */}
        <Route path="/search" element={<Search />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="regions" element={<RegionList />} />
          <Route path="regions/create" element={<RegionForm />} />
          <Route path="regions/:id/edit" element={<RegionForm />} />
          <Route path="countries" element={<CountryList />} />
          <Route path="countries/create" element={<CountryForm />} />
          <Route path="countries/:slug/edit" element={<CountryForm />} />

          <Route
            path="countries/:country_slug/travel-deals"
            element={<TravelDealList />}
          />
          <Route
            path="countries/:country_slug/travel-deals/create"
            element={<TravelDealForm />}
          />
          <Route
            path="countries/:country_slug/travel-deals/:slug/edit"
            element={<TravelDealForm />}
          />

          <Route
            path="countries/:country_slug/reviews"
            element={<ReviewList />}
          />
          <Route
            path="countries/:country_slug/reviews/create"
            element={<ReviewForm />}
          />
          <Route
            path="countries/:country_slug/reviews/:id/edit"
            element={<ReviewForm />}
          />

          <Route path="countries/:country_slug/faqs" element={<FAQList />} />
          <Route
            path="countries/:country_slug/faqs/create"
            element={<FAQForm />}
          />
          <Route
            path="countries/:country_slug/faqs/:id/edit"
            element={<FAQForm />}
          />

          <Route
            path="countries/:country_slug/overview"
            element={<CountryOverviewList />}
          />
          <Route
            path="countries/:country_slug/overview/create"
            element={<CountryOverviewForm />}
          />
          <Route
            path="countries/:country_slug/overview/:id/edit"
            element={<CountryOverviewForm />}
          />

          <Route
            path="countries/:country_slug/learn-more-topics"
            element={<LearnMoreTopicList />}
          />
          <Route
            path="countries/:country_slug/learn-more-topics/create"
            element={<LearnMoreTopicForm />}
          />
          <Route
            path="countries/:country_slug/learn-more-topics/:id/edit"
            element={<LearnMoreTopicForm />}
          />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}

      {/* ✅ Show chatbot only outside auth & payment pages */}
      {showChatBot && <ChatBot />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
