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
import Contact from "./components/Contact";

// Pages
import AboutUs from "./pages/Aboutus";
import AllDestinations from "./pages/AllDestinations";
import DestinationPage from "./pages/DestinationPage";
import DestDescription from "./pages/destdescription";
import Blogs from "./pages/blogs";
import BlogDetail from "./pages/BlogDetail";
import Write from "./pages/write";

// Search Page
import Search from "./components/search";

// Payment pages
import Payment1 from "./payment/payment1";
import Payment2 from "./payment/payment2";
import Payment3 from "./payment/payment3";
import ThankYou from "./payment/ThankYou";

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

  const hideLayout = noLayoutRoutes.some((path) =>
    matchPath({ path, end: false }, location.pathname)
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
        <Route path="/contact" element={<Contact />} />

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
        <Route path="/blogs/:slug" element={<BlogDetail />} />

        {/* Write Blog */}
        <Route path="/write" element={<Write />} />

        {/* Search */}
        <Route path="/search" element={<Search />} />
      </Routes>

      {!hideLayout && <Footer />}

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
