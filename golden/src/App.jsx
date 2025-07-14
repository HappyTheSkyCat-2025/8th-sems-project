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

// Auth pages
import Login from "./Auth/login";
import Register from "./Auth/Register";
import VerifyOTP from "./Auth/VerifyOTP";
import ForgotPassword from "./Auth/ForgotPassword";
import ResetPassword from "./Auth/ResetPassword";
import Profile from "./Auth/profile";

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

// Payment pages
import Payment1 from "./payment/payment1";
import Payment2 from "./payment/payment2";
import Payment3 from "./payment/payment3";

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


function Layout() {
  const location = useLocation();

  // Routes where Navbar/Footer should NOT be shown
  const noLayoutRoutes = [
    "/login",
    "/register",
    "/verify-otp",
    "/forgot-password",
    "/reset-password",
    "/payment",
    "/payment/payment2",
    "/payment/payment3",
  ];

  // Admin routes where Navbar/Footer should also NOT be shown
  const adminRoutes = [
    "/admin",
    "/admin/regions",
    "/admin/regions/create",
    "/admin/regions/:id/edit",
  ];

  // Determine if current path matches any of the no-layout routes
  const hideLayout =
    noLayoutRoutes.some((path) =>
      matchPath({ path, end: true }, location.pathname)
    ) ||
    adminRoutes.some((path) =>
      location.pathname.startsWith(path.replace(":id", ""))
    );

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* === Public Routes === */}
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

        {/* === Auth Routes === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* === Payment Routes === */}
        <Route path="/payment" element={<Payment1 />} />
        <Route path="/payment/payment2" element={<Payment2 />} />
        <Route path="/payment/payment3" element={<Payment3 />} />

        {/* === Admin Routes (Region & Country CRUD) === */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          {/* Region CRUD */}
          <Route path="regions" element={<RegionList />} />
          <Route path="regions/create" element={<RegionForm />} />
          <Route path="regions/:id/edit" element={<RegionForm />} />

          {/* Country CRUD */}
          <Route path="countries" element={<CountryList />} />
          <Route path="countries/create" element={<CountryForm />} />
          <Route path="countries/:slug/edit" element={<CountryForm />} />
          
          {/* Travel Deal CRUD */}
          <Route path="countries/:country_slug/travel-deals" element={<TravelDealList />} />
          <Route path="countries/:country_slug/travel-deals/create" element={<TravelDealForm />} />
          <Route path="countries/:country_slug/travel-deals/:slug/edit" element={<TravelDealForm />} />
         
          <Route path="countries/:country_slug/reviews" element={<ReviewList />} />
          <Route path="countries/:country_slug/reviews/create" element={<ReviewForm />} />
          <Route path="countries/:country_slug/reviews/:id/edit" element={<ReviewForm />} />

          <Route path="countries/:country_slug/faqs" element={<FAQList />} />
          <Route path="countries/:country_slug/faqs/create" element={<FAQForm />} />
          <Route path="countries/:country_slug/faqs/:id/edit" element={<FAQForm />} />

          <Route path="countries/:country_slug/overview" element={<CountryOverviewList />} />
          <Route path="countries/:country_slug/overview/create" element={<CountryOverviewForm />} />
          <Route path="countries/:country_slug/overview/:id/edit" element={<CountryOverviewForm />} />

          <Route path="countries/:country_slug/learn-more-topics" element={<LearnMoreTopicList />} />
          <Route path="countries/:country_slug/learn-more-topics/create" element={<LearnMoreTopicForm />} />
          <Route path="countries/:country_slug/learn-more-topics/:id/edit" element={<LearnMoreTopicForm />} />

          {/* Additional Admin Routes can be added here */}
          {/*
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/create" element={<ArticleForm />} />
          <Route path="articles/:id/edit" element={<ArticleForm />} />
          <Route path="travel-types" element={<TravelTypeList />} />
          <Route path="travel-types/create" element={<TravelTypeForm />} />
          <Route path="travel-types/:id/edit" element={<TravelTypeForm />} />
          <Route path="deal-categories" element={<DealCategoryList />} />
          <Route path="deal-categories/create" element={<DealCategoryForm />} />
          <Route path="deal-categories/:id/edit" element={<DealCategoryForm />} />
          */}
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  );
}

export default App;
